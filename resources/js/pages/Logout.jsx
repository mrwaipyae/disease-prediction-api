import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear persisted auth state from localStorage
        localStorage.removeItem("persist:auth");

        // Optionally clear other app state if needed
        // localStorage.clear(); // if you want to clear everything

        // Redirect to login page
        navigate("/login");
    }, [navigate]);

    return null; // or a loading spinner if you like
}
