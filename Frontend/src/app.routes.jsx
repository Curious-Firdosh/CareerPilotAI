import { createBrowserRouter } from "react-router";
import Login from "./features/auth/Pages/Login";
import Register from "./features/auth/Pages/Register";
import Home from "./features/auth/Pages/Home";
import Protected from "./features/auth/Components/Protected";
import PublicRoute from "./features/auth/Components/PublicRoute";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <PublicRoute><Login/></PublicRoute>
    },
    {
        path: "/register",
        element: <PublicRoute><Register/></PublicRoute>
    },
    {
        path: "/",
        element: <Protected><Home/></Protected>
    }
])