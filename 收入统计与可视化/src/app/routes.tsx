import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./pages/Dashboard";
import { RevenueStats } from "./pages/RevenueStats";
import { ScooterManagement } from "./pages/ScooterManagement";
import { ScooterMap } from "./pages/ScooterMap";
import { RevenueForecast } from "./pages/RevenueForecast";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "revenue", Component: RevenueStats },
      { path: "scooters", Component: ScooterManagement },
      { path: "map", Component: ScooterMap },
      { path: "forecast", Component: RevenueForecast },
      { path: "*", Component: NotFound },
    ],
  },
]);
