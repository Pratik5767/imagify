import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext);

    if (user === null) {
        return <Navigate to='/' replace />
    }

    return children;
};

export default ProtectedRoute;