import { createBrowserRouter } from "react-router";
import Login from "./features/auth/Pages/Login";
import Register from "./features/auth/Pages/Register";
import Home from "./features/Interview/pages/Home";
import Protected from "./features/auth/Components/Protected";
import PublicRoute from "./features/auth/Components/PublicRoute";
import Interview from "./features/Interview/Pages/Interview";
import GenerateReport from "./features/Interview/Pages/GenerateReport";

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
    },
    {
        path : '/generatereport',
        element : <Protected><GenerateReport/></Protected>
    },
    {
        path: "/interview/report/:id",
        element: <Interview/>
    }
])