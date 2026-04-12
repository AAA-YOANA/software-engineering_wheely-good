import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const TripPage = lazy(() => import("./pages/TripPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));

function navCls({ isActive }: { isActive: boolean }) {
  return [
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-white/20 text-white"
      : "text-white/80 hover:bg-white/10 hover:text-white",
  ].join(" ");
}

export function Shell() {
  return (
    <BrowserRouter>
      <div className="flex h-dvh flex-col bg-zinc-950">
        <header className="shrink-0 border-b border-white/10 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
            <span className="mr-2 font-semibold text-white">WheelyGood</span>
            <nav className="flex flex-wrap gap-1">
              <NavLink to="/login" className={navCls}>
                登录
              </NavLink>
              <NavLink to="/discover" className={navCls}>
                发现
              </NavLink>
              <NavLink to="/booking" className={navCls}>
                详情与预定
              </NavLink>
              <NavLink to="/trip" className={navCls}>
                行程
              </NavLink>
              <NavLink to="/profile" className={navCls}>
                个人资料
              </NavLink>
              <NavLink to="/feedback" className={navCls}>
                客户反馈
              </NavLink>
            </nav>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto bg-white">
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
                加载中…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/trip" element={<TripPage />} />
              <Route path="/booking" element={<BookingPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
