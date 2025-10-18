import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);

    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/user/credits`, {
                headers: { token }
            });
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/image/generate-image`, { prompt }, {
                headers: { token }
            });
            if (data.success) {
                loadCreditsData();
                return data.resultImage;
            } else {
                toast.error(data.message);
                loadCreditsData();

                if (data.creditBalance === 0) {
                    navigate("/buy");
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    }

    useEffect(() => {
        if (token) {
            loadCreditsData();
        }
    }, [token])

    const value = {
        navigate,
        backendURL,
        user, setUser,
        showLogin, setShowLogin,
        token, setToken,
        credit, setCredit,
        loadCreditsData,
        logout,
        generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;