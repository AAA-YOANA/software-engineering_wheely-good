import os
import re
import tempfile

import pytest

from app import create_app
from extensions import db
from models import Scooter, User

_BACKLOG_ID_RE = re.compile(r"test_backlog_(\d+)([a-z]?)")
_PYTEST_CONFIG = None  # set in pytest_configure; used by pytest_runtest_logreport

# ---------------------------------------------------------------------------
# Optional: simplified table after run (disable with: pytest --no-backlog-table)
# ---------------------------------------------------------------------------


def pytest_addoption(parser):
    parser.addoption(
        "--no-backlog-table",
        action="store_true",
        default=False,
        help="Do not print backlog summary table after tests",
    )


def pytest_configure(config):
    global _PYTEST_CONFIG
    _PYTEST_CONFIG = config
    config.backlog_rows = []


def pytest_runtest_logreport(report) -> None:
    """Record pass/skip/fail for backlog tests.

    Skipped tests often only emit ``setup`` with outcome ``skipped`` (no ``call`` phase).
    Passed/failed are recorded on ``call`` only to avoid duplicate rows.
    """
    nodeid = report.nodeid
    if "test_backlog" not in nodeid:
        return
    if _PYTEST_CONFIG is None:
        return

    if report.outcome == "passed" or report.outcome == "failed":
        if report.when != "call":
            return
    elif report.outcome == "skipped":
        if report.when not in ("setup", "call"):
            return
    else:
        return

    m = _BACKLOG_ID_RE.search(nodeid)
    backlog_id = m.group(1) + (m.group(2) or "") if m else "?"

    short_name = nodeid.split("::")[-1]
    if report.outcome == "passed":
        status, note = "PASS", ""
    elif report.outcome == "skipped":
        status, note = "SKIPPED", _skip_reason(report)
    elif report.outcome == "failed":
        status, note = "FAIL", ""
    else:
        status, note = report.outcome.upper(), ""

    _PYTEST_CONFIG.backlog_rows.append((backlog_id, status, short_name, note))


def _skip_reason(report) -> str:
    lr = report.longrepr
    if isinstance(lr, tuple) and len(lr) >= 3:
        text = str(lr[2])
    else:
        text = str(lr or "")
    for prefix in ("Skipped: ", "skip ", "SKIP "):
        if text.startswith(prefix):
            text = text[len(prefix) :].strip()
    return text.replace("\n", " ")[:120]


def pytest_sessionfinish(session: pytest.Session, exitstatus: int) -> None:
    if session.config.getoption("--no-backlog-table"):
        return
    rows = getattr(session.config, "backlog_rows", [])
    if not rows:
        return

    def sort_key(r: tuple[str, str, str, str]) -> tuple:
        bid = r[0]
        num = "".join(c for c in bid if c.isdigit()) or "0"
        suf = bid[len(num) :] if len(bid) > len(num) else ""
        return (int(num), suf, r[2])

    rows = sorted(rows, key=sort_key)

    total_w = 100
    print("\n")
    print("=" * total_w)
    print(" BACKLOG TEST SUMMARY (simplified)")
    print("=" * total_w)
    col_id, col_st, col_name, col_note = 8, 10, 34, 46
    header = (
        f"{'ID':<{col_id}}"
        f"{'Status':<{col_st}}"
        f"{'Test':<{col_name}}"
        f"{'Notes (if skipped)':<{col_note}}"
    )
    print(header)
    print("-" * total_w)
    for bid, status, name, note in rows:
        name_disp = name[: col_name - 1] + "…" if len(name) >= col_name else name
        note_disp = (note[: col_note - 1] + "…") if len(note) >= col_note else note
        if status == "SKIPPED" and note:
            print(
                f"{bid:<{col_id}}{status:<{col_st}}{name_disp:<{col_name}}{note_disp}"
            )
        else:
            print(f"{bid:<{col_id}}{status:<{col_st}}{name_disp:<{col_name}}{''}")

    passed = sum(1 for r in rows if r[1] == "PASS")
    skipped = sum(1 for r in rows if r[1] == "SKIPPED")
    failed = sum(1 for r in rows if r[1] == "FAIL")
    print("-" * total_w)
    print(
        f" Totals (pytest rows):  PASS={passed}  SKIPPED={skipped}  FAIL={failed}  (rows={len(rows)})"
    )
    print(
        " Note: rows > 25 because one Word backlog may map to several tests (e.g. #4 has 4 durations)."
    )

    by_word = _aggregate_by_word_backlog(rows)
    print("-" * total_w)
    print(f" Word backlog (1..25):  {len(by_word)} items (rollup)")
    print("=" * total_w + "\n")


def _word_id_from_cell(bid: str) -> int:
    """Map pytest id like '04', '22a', '22b' to Word backlog number 1..25."""
    m = re.match(r"^(\d+)", bid)
    if not m:
        return -1
    return int(m.group(1))


def _aggregate_by_word_backlog(rows):
    """One entry per Word ID 1..25 with rollup status across all pytest cases."""
    groups: dict[int, dict] = {}
    for bid, status, name, note in rows:
        wid = _word_id_from_cell(bid)
        if wid < 1 or wid > 25:
            continue
        if wid not in groups:
            groups[wid] = {
                "statuses": [],
                "notes": [],
                "count": 0,
            }
        groups[wid]["statuses"].append(status)
        groups[wid]["count"] += 1
        if status == "SKIPPED" and note:
            groups[wid]["notes"].append(note)

    out: dict[int, dict] = {}
    for wid, g in groups.items():
        st = g["statuses"]
        if "FAIL" in st:
            rollup = "FAIL"
        elif "PASS" in st and "SKIPPED" in st:
            rollup = "PARTIAL"
        elif all(x == "SKIPPED" for x in st):
            rollup = "SKIPPED"
        else:
            rollup = "PASS"
        notes = ""
        if rollup in ("SKIPPED", "PARTIAL"):
            uniq = []
            for n in g["notes"]:
                if n and n not in uniq:
                    uniq.append(n)
            notes = " | ".join(uniq)[:500]
        out[wid] = {
            "rollup": rollup,
            "count": g["count"],
            "notes": notes,
        }
    return out


@pytest.fixture
def app():
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    try:
        application = create_app(
            {
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": f"sqlite:///{path}",
                "SQLALCHEMY_ENGINE_OPTIONS": {"connect_args": {"check_same_thread": False}},
            }
        )
        with application.app_context():
            db.create_all()
        yield application
        with application.app_context():
            db.drop_all()
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def json_headers():
    return {"Content-Type": "application/json"}


def register_and_token(client, json_headers, email="testuser@example.com", password="password12"):
    r = client.post(
        "/api/auth/register",
        json={"name": "Test User", "email": email, "password": password},
        headers=json_headers,
    )
    assert r.status_code == 201, r.get_data(as_text=True)
    data = r.get_json()
    return data["access_token"], data["user"]["id"]


def auth_header(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


@pytest.fixture
def user_token(client, json_headers):
    token, _ = register_and_token(client, json_headers)
    return token


@pytest.fixture
def sample_scooter(app):
    with app.app_context():
        s = Scooter(
            scooter_code="T-SCOOT-1",
            name="Test Scooter",
            current_battery=90,
            status="available",
            current_location="Test Plaza",
            latitude=39.9,
            longitude=116.4,
            image_url="https://example.com/x.jpg",
        )
        db.session.add(s)
        db.session.commit()
        sid = s.id
    return sid
