import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { UserDetail } from "./pages/UserDetail";
import { CreateBooking } from "./pages/CreateBooking";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "users", Component: Users },
      { path: "users/:userId", Component: UserDetail },
      { path: "create-booking", Component: CreateBooking },
    ],
  },
]);
