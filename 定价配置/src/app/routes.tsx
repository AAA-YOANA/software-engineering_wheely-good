import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { ScootersPage } from "./pages/scooters";
import { PricingPage } from "./pages/pricing";
import { DiscountsPage } from "./pages/discounts";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: ScootersPage },
      { path: "pricing", Component: PricingPage },
      { path: "discounts", Component: DiscountsPage },
    ],
  },
]);
