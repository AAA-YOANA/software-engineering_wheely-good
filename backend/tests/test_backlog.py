"""
Project Backlog 1 — 与 Word 中每条 backlog 一一对应的自动化测试。

编号与文档一致：
  F = 功能需求, N = 非功能需求；优先级 1=高, 2=低（文档中的 3 视为更低）。

Skipped tests use @pytest.mark.skip with reason "Pending implementation: …" (shown as skipped in pytest output).
Implemented features must pass assertions.
"""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

import pytest

from extensions import db
from models import Booking, Scooter, User
from tests.conftest import auth_header, register_and_token

# ---------------------------------------------------------------------------
# Backlog #1 — Support user accounts and user login (F, high)
# ---------------------------------------------------------------------------


def test_backlog_01_user_accounts_and_login(client, json_headers):
    """注册、登录、JWT、获取当前用户。"""
    r = client.post(
        "/api/auth/register",
        json={"name": "U1", "email": "u1@backlog.test", "password": "password12"},
        headers=json_headers,
    )
    assert r.status_code == 201
    assert "access_token" in r.get_json()

    r = client.post(
        "/api/auth/login",
        json={"email": "u1@backlog.test", "password": "password12"},
        headers=json_headers,
    )
    assert r.status_code == 200
    token = r.get_json()["access_token"]

    r = client.get("/api/auth/me", headers=auth_header(token))
    assert r.status_code == 200
    assert r.get_json()["user"]["email"] == "u1@backlog.test"


# ---------------------------------------------------------------------------
# Backlog #2 — Store customer's card details for quicker bookings (F, low)
# ---------------------------------------------------------------------------


def test_backlog_02_store_card_details_for_bookings(client, json_headers, user_token):
    """保存支付方式（卡号后四位等）供后续预订使用。"""
    h = auth_header(user_token)
    r = client.post(
        "/api/payment-methods",
        json={"type": "visa", "last4": "4242", "isDefault": True, "holderName": "Test"},
        headers=h,
    )
    assert r.status_code == 201
    r2 = client.get("/api/payment-methods", headers=h)
    assert r2.status_code == 200
    methods = r2.get_json()["payment_methods"]
    assert any(m.get("last4") == "4242" for m in methods)


# ---------------------------------------------------------------------------
# Backlog #3 — Good security for user accounts if ID2 (NF, low)
# ---------------------------------------------------------------------------


def test_backlog_03_security_basics_password_and_jwt(client, json_headers):
    """短密码拒绝；错误密码无法登录；受保护接口无 token 返回 401。"""
    r = client.post(
        "/api/auth/register",
        json={"name": "X", "email": "short@backlog.test", "password": "short"},
        headers=json_headers,
    )
    assert r.status_code == 400

    client.post(
        "/api/auth/register",
        json={"name": "Y", "email": "good@backlog.test", "password": "password12"},
        headers=json_headers,
    )
    r = client.post(
        "/api/auth/login",
        json={"email": "good@backlog.test", "password": "wrongpassword"},
        headers=json_headers,
    )
    assert r.status_code == 401

    r = client.get("/api/scooters", headers=json_headers)
    assert r.status_code == 401


# ---------------------------------------------------------------------------
# Backlog #4 — View hire options and cost: 1hr, 4hrs, 1day, 1week (F, high)
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "hours,label",
    [(1, "1hr"), (4, "4hrs"), (24, "1day"), (168, "1week")],
)
def test_backlog_04_hire_options_and_costs_quote(
    client, json_headers, user_token, sample_scooter, hours, label
):
    """报价接口对 1h / 4h / 24h / 168h 返回可计费字段（与文档四种时长对应）。"""
    r = client.post(
        "/api/bookings/quote",
        json={"scooter_id": sample_scooter, "duration_hours": hours},
        headers=auth_header(user_token),
    )
    assert r.status_code == 200, label
    q = r.get_json()
    assert "final_rental_price" in q
    assert "price_per_hour" in q
    assert "total_amount" in q


# ---------------------------------------------------------------------------
# Backlog #5 — Book e-scooter; select ID and hire period (F, high)
# ---------------------------------------------------------------------------


def test_backlog_05_book_scooter_select_id_and_period(client, json_headers, user_token, sample_scooter):
    """创建预订：指定 scooter_id 与 duration_hours。"""
    r = client.post(
        "/api/bookings/create",
        json={
            "scooter_id": sample_scooter,
            "duration_hours": 3,
            "start_location": "Backlog5",
        },
        headers=auth_header(user_token),
    )
    assert r.status_code == 201
    b = r.get_json()["booking"]
    assert b["scooter"]["id"] == sample_scooter
    assert b.get("duration_hours") == 3 or b.get("duration_hours") is not None


# ---------------------------------------------------------------------------
# Backlog #6 — Handle card payment for booking (simulated) (F, high)
# ---------------------------------------------------------------------------


def test_backlog_06_simulated_card_payment(client, json_headers, user_token, sample_scooter):
    """模拟支付成功并产生交易参考号。"""
    r = client.post(
        "/api/bookings/create",
        json={
            "scooter_id": sample_scooter,
            "duration_hours": 1,
            "start_location": "P",
        },
        headers=auth_header(user_token),
    )
    assert r.status_code == 201
    bid = r.get_json()["booking"]["id"]
    r = client.post(
        "/api/payments/pay",
        json={"booking_id": bid, "payment_method": "card"},
        headers=auth_header(user_token),
    )
    assert r.status_code == 200
    pay = r.get_json()["payment"]
    assert pay["status"] == "paid"
    assert pay.get("transaction_ref")


# ---------------------------------------------------------------------------
# Backlog #7 — Send booking confirmation via email (F, low)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #7): email confirmation — no SMTP/queue"
)
def test_backlog_07_email_booking_confirmation():
    """验收：预订成功后向用户邮箱发送确认（当前无实现）。"""


# ---------------------------------------------------------------------------
# Backlog #8 — Store confirmation and display on demand (F, low)
# ---------------------------------------------------------------------------


def test_backlog_08_confirmation_stored_and_retrievable(client, json_headers, user_token, sample_scooter):
    """预订确认数据可通过 API 再次查询。"""
    r = client.post(
        "/api/bookings/create",
        json={
            "scooter_id": sample_scooter,
            "duration_hours": 2,
            "start_location": "C",
        },
        headers=auth_header(user_token),
    )
    bid = r.get_json()["booking"]["id"]
    r2 = client.get(
        f"/api/bookings/{bid}/confirmation",
        headers=auth_header(user_token),
    )
    assert r2.status_code == 200
    assert r2.get_json()["booking"]["id"] == bid


# ---------------------------------------------------------------------------
# Backlog #9 — Staff: bookings for unregistered users (needs #7) (F, low)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #9): staff booking for unregistered users"
)
def test_backlog_09_staff_booking_for_guest():
    """验收：员工为未注册用户创建预订并触发确认（依赖 #7）。"""


# ---------------------------------------------------------------------------
# Backlog #10 — Update e-scooter status available / unavailable (F, low)
# ---------------------------------------------------------------------------


def test_backlog_10_scooter_status_transitions(client, json_headers, user_token, sample_scooter):
    """解锁后车辆 in-use；结束行程后恢复为可用类状态。"""
    h = auth_header(user_token)
    r = client.get(f"/api/scooters/{sample_scooter}", headers=h)
    assert r.get_json()["scooter"]["status"] == "available"

    r = client.post(
        "/api/bookings/unlock",
        json={"scooter_id": sample_scooter, "start_location": "S"},
        headers=h,
    )
    assert r.status_code == 201
    bid = r.get_json()["booking"]["id"]

    r = client.get(f"/api/scooters/{sample_scooter}", headers=h)
    assert r.get_json()["scooter"]["status"] == "in-use"

    r = client.post(
        f"/api/bookings/{bid}/end",
        json={"end_location": "E", "distance_km": 0.5, "battery_end": 85},
        headers=h,
    )
    assert r.status_code == 200
    st = r.get_json()["booking"]["status"]
    assert st == "completed"


# ---------------------------------------------------------------------------
# Backlog #11 — Extend current booking (F, low)
# ---------------------------------------------------------------------------


def test_backlog_11_extend_current_booking(client, json_headers, user_token, sample_scooter):
    """延长进行中的行程。"""
    h = auth_header(user_token)
    r = client.post(
        "/api/bookings/unlock",
        json={"scooter_id": sample_scooter, "start_location": "S2"},
        headers=h,
    )
    bid = r.get_json()["booking"]["id"]
    r = client.post(
        f"/api/trips/{bid}/extend",
        json={"extra_minutes": 20},
        headers=h,
    )
    assert r.status_code == 200


# ---------------------------------------------------------------------------
# Backlog #12 — Cancel booking (F, high)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #12): cancel booking API / state machine"
)
def test_backlog_12_cancel_booking():
    """验收：用户或员工可取消未开始/待支付订单并释放车辆。"""


# ---------------------------------------------------------------------------
# Backlog #13 — Short feedback for issues/faults (F, low)
# ---------------------------------------------------------------------------


def test_backlog_13_feedback_issues(client, json_headers, app, user_token, sample_scooter):
    """提交简短故障反馈并可列表查看。"""
    with app.app_context():
        u = User.query.filter_by(email="testuser@example.com").first()
        b = Booking(
            user_id=u.id,
            scooter_id=sample_scooter,
            start_time=datetime.utcnow(),
            start_location="L",
            battery_start=90,
            status="completed",
            duration_minutes=5,
            cost=1,
            booking_type="instant",
            payment_status="paid",
        )
        db.session.add(b)
        db.session.commit()

    h = auth_header(user_token)
    r = client.post(
        "/api/issues",
        json={"type": "battery", "description": "Drains fast"},
        headers=h,
    )
    assert r.status_code == 201
    r2 = client.get("/api/issues", headers=h)
    assert r2.status_code == 200
    assert len(r2.get_json()["feedbacks"]) >= 1


# ---------------------------------------------------------------------------
# Backlog #14 — Prioritise feedback: escalate / resolve (F, low)
# ---------------------------------------------------------------------------


def test_backlog_14_feedback_priority_field_exists(client, json_headers, app, user_token, sample_scooter):
    """创建反馈时系统记录 priority（当前实现固定为 low；升级工作流未做）。"""
    with app.app_context():
        u = User.query.filter_by(email="testuser@example.com").first()
        b = Booking(
            user_id=u.id,
            scooter_id=sample_scooter,
            start_time=datetime.utcnow(),
            start_location="L2",
            battery_start=88,
            status="completed",
            duration_minutes=5,
            cost=1,
            booking_type="instant",
            payment_status="paid",
        )
        db.session.add(b)
        db.session.commit()

    r = client.post(
        "/api/issues",
        json={"type": "tire", "description": "Flat"},
        headers=auth_header(user_token),
    )
    assert r.status_code == 201
    assert r.get_json()["issue"].get("priority") == "low"


@pytest.mark.skip(
    reason="Pending implementation (Backlog #14): escalation workflow / staff API"
)
def test_backlog_14_escalation_workflow():
    """验收：员工将工单标为高优先级并进入处理队列。"""


# ---------------------------------------------------------------------------
# Backlog #15 — View high priority issues (F, low)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #15): staff view — high-priority issues only"
)
def test_backlog_15_staff_view_high_priority_issues():
    """验收：员工筛选并查看高优先级故障。"""


# ---------------------------------------------------------------------------
# Backlog #16 — Configure e-scooter details and costs (F, high)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #16): admin configure scooters and pricing"
)
def test_backlog_16_admin_configure_scooter_and_pricing():
    """验收：管理员可编辑车辆信息、单价与折扣规则。"""


# ---------------------------------------------------------------------------
# Backlog #17 — Display scooter list: availability / location (F, low)
# ---------------------------------------------------------------------------


def test_backlog_17_list_shows_availability_and_location(client, json_headers, user_token, sample_scooter):
    """列表返回状态与位置相关字段。"""
    r = client.get("/api/scooters", headers=auth_header(user_token))
    assert r.status_code == 200
    items = r.get_json()["scooters"]
    one = next(x for x in items if x["id"] == sample_scooter)
    assert "status" in one
    assert "position" in one or "current_location" in one


# ---------------------------------------------------------------------------
# Backlog #18 — Five scooter locations on a visual map (F, low)
# ---------------------------------------------------------------------------


def test_backlog_18_map_data_five_locations_in_api(client, json_headers, app, user_token):
    """
    文档要求地图展示 5 处；后端应能提供至少 5 条带坐标的车辆/点位。
    （地图 UI 属前端 E2E，此处只测 API 数据是否满足「可画 5 点」。）
    """
    with app.app_context():
        for i in range(5):
            db.session.add(
                Scooter(
                    scooter_code=f"MAP-{i}",
                    name=f"Map Scooter {i}",
                    current_battery=80,
                    status="available",
                    current_location=f"Loc {i}",
                    latitude=39.9 + i * 0.001,
                    longitude=116.4 + i * 0.001,
                )
            )
        db.session.commit()

    r = client.get("/api/scooters", headers=auth_header(user_token))
    items = r.get_json()["scooters"]
    with_coords = [x for x in items if x.get("position") and len(x["position"]) == 2]
    assert len(with_coords) >= 5


# ---------------------------------------------------------------------------
# Backlog #19 — Weekly income by rental option: 1hr, 4hr, day, week (F, high)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #19): weekly income by hire length (1h/4h/day/week)"
)
def test_backlog_19_weekly_income_by_hire_length():
    """验收：管理报表按 1h/4h/day/week 汇总周收入。"""


# ---------------------------------------------------------------------------
# Backlog #20 — Combined daily income over a week (F, low)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #20): daily combined income over one week"
)
def test_backlog_20_daily_income_over_week():
    """验收：7 天每日合计收入（含各时长与周租折扣）。"""


# ---------------------------------------------------------------------------
# Backlog #21 — Plot weekly income graphically (F, low)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #21): graphical income report API/export"
)
def test_backlog_21_weekly_income_chart():
    """验收：#19/#20 数据可图形化展示。"""


# ---------------------------------------------------------------------------
# Backlog #22 — Discount: 8+ hrs/week, students, seniors (F, low)
# ---------------------------------------------------------------------------


def test_backlog_22a_duration_based_discount_eight_hours(client, json_headers, user_token, sample_scooter):
    """按时长阶梯：≥8 小时享受更高折扣率（与现有 calculate_quote 一致）。"""
    r = client.post(
        "/api/bookings/quote",
        json={"scooter_id": sample_scooter, "duration_hours": 8},
        headers=auth_header(user_token),
    )
    assert r.status_code == 200
    assert r.get_json()["discount_rate"] == 0.15


@pytest.mark.skip(
    reason="Pending implementation (Backlog #22): user-segment discounts (student/senior/frequent)"
)
def test_backlog_22b_user_segment_discounts():
    """验收：学生、长者、周≥8h 常客身份折扣。"""


# ---------------------------------------------------------------------------
# Backlog #23 — Multiple clients simultaneously (F, low)
# ---------------------------------------------------------------------------


def test_backlog_23_multiple_independent_users(client, json_headers):
    """多用户独立注册并各自持有 token（并发友好架构下的 API 层验证）。"""
    tokens = []
    for i in range(5):
        t, _ = register_and_token(
            client,
            json_headers,
            email=f"concurrent{i}@backlog.test",
            password="password12",
        )
        tokens.append(t)
    assert len(set(tokens)) == 5


def test_backlog_23_parallel_register_requests(client, json_headers):
    """并行发起注册请求，均应成功（SQLite 单测下作并发冒烟）。"""

    def one_reg(i):
        return client.post(
            "/api/auth/register",
            json={
                "name": f"P{i}",
                "email": f"par{i}@backlog.test",
                "password": "password12",
            },
            headers=json_headers,
        ).status_code

    with ThreadPoolExecutor(max_workers=5) as pool:
        futs = [pool.submit(one_reg, i) for i in range(5)]
        codes = [f.result() for f in as_completed(futs)]
    assert all(c == 201 for c in codes)


# ---------------------------------------------------------------------------
# Backlog #24 — Responsive user interface (NF, low)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #24): responsive UI — requires frontend E2E (pytest covers backend only)"
)
def test_backlog_24_responsive_ui():
    """验收：主要页面在移动端/窄屏可用。"""


# ---------------------------------------------------------------------------
# Backlog #25 — Accessibility: colour & font (NF, low)
# ---------------------------------------------------------------------------


@pytest.mark.skip(
    reason="Pending implementation (Backlog #25): accessibility audit (e.g. axe/Lighthouse); not covered by backend tests"
)
def test_backlog_25_accessibility():
    """验收：对比度、字号、焦点顺序符合可访问性要求。"""
