import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/Pages/Login";
import Register from "./features/auth/Pages/Register";
import Home from "./features/Interview/Pages/Home";
import Protected from "./features/auth/Components/Protected";
import PublicRoute from "./features/auth/Components/PublicRoute";
import Interview from "./features/Interview/Pages/Interview";
import GenerateReport from "./features/Interview/Pages/GenerateReport";
import PricingCards from "./features/Interview/Pages/PricingCards";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        )
    },
    {
        path: "/register",
        element: (
            <PublicRoute>
                <Register />
            </PublicRoute>
        )
    },
    {
        path: "/",
        element: (
            <Protected>
                <Home />
            </Protected>

        )
    },
    {
        path: "/generatereport",
        element: (
            <Protected>
                <GenerateReport />
            </Protected>
        )
    },
    {
        path: "/interview/report/:id",
        element: (

            <Protected>
                <Interview />
            </Protected>

        )
    },
     {
        path: "/upgrade",
        element: (
            <Protected>
                <PricingCards/>
            </Protected>

        )
    }
]);

