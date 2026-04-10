

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    [key: string]: unknown;
}

const Validate = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Parse user from localStorage
        let userData: User | null = null;
        try {
            const userString = localStorage.getItem("user");
            userData = userString ? JSON.parse(userString) : null;
        } catch (e) {
            console.error("Failed to parse user from localStorage:", e);
            userData = null;
        }

        // Check if user has organizer or admin role
        if (!userData || (userData.role !== "organizer" && userData.role !== "admin")) {
            setIsAuthorized(false);
            setUser(userData);
            return;
        }

        // User is authorized
        setIsAuthorized(true);
        setUser(userData);
    }, [navigate]);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        console.log(user)
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Access Denied</h1>
                <p>You are not authorized to access this page.</p>
                <p>This page is only accessible to organizers.</p>
                {user && <p>Your role: <strong>{user.role}</strong></p>}
            </div>
        );
    }

    return (
        <div>
            <h1>Validate Tickets</h1>
            {user && <p>Welcome, {user.name}!</p>}
        </div>
    );
};

export default Validate;