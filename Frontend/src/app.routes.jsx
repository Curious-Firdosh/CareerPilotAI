import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/Pages/Login";
import Register from "./features/auth/Pages/Register";
import Home from "./features/Interview/Pages/Home";
import Protected from "./features/auth/Components/Protected";
import PublicRoute from "./features/auth/Components/PublicRoute";
import Interview from "./features/Interview/Pages/Interview";
import GenerateReport from "./features/Interview/Pages/GenerateReport";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            
                <Login />
            
        )
    },
    {
        path: "/register",
        element: (
           
                <Register />
        
        )
    },
    {
        path: "/",
        element: (
            
                <Home />
        

        )
    },
    {
        path: "/generatereport",
        element: (
            
                <GenerateReport />
            
        )
    },
    {
        path: "/interview/report/:id",
        element: (

           
                <Interview />
           

        )
    }
]);