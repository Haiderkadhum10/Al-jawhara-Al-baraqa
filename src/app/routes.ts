import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedDashboard } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, lazy: async () => ({ Component: (await import("./pages/Home")).Home }) },
      { path: "products", lazy: async () => ({ Component: (await import("./pages/Products")).Products }) },
      { path: "products/:id", lazy: async () => ({ Component: (await import("./pages/ProductDetail")).ProductDetail }) },
      { path: "about", lazy: async () => ({ Component: (await import("./pages/About")).About }) },
      { path: "contact", lazy: async () => ({ Component: (await import("./pages/Contact")).Contact }) },
      { path: "*", lazy: async () => ({ Component: (await import("./pages/NotFound")).NotFound }) },
    ],
  },
  {
    path: "/login",
    lazy: async () => ({ Component: (await import("./pages/Login")).Login }),
  },
  {
    path: "/dashboard",
    Component: ProtectedDashboard,
  },
]);


