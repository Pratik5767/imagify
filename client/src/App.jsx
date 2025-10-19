import { useContext } from "react"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Navbar from "./components/Navbar"
import BuyCredits from "./pages/BuyCredits"
import Home from "./pages/Home"
import Result from "./pages/Result"
import { Routes, Route } from "react-router-dom"
import { AppContext } from "./context/AppContext"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
    const { showLogin } = useContext(AppContext);

    return (
        <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
            <ToastContainer position="bottom-right" />

            <Navbar />

            {
                showLogin && <Login />
            }

            <Routes>
                <Route path="/" element={<Home />} />

                <Route
                    path="/result"
                    element={
                        <ProtectedRoute>
                            <Result />
                        </ProtectedRoute>
                    }
                />

                <Route path="/buy" element={<BuyCredits />} />
            </Routes>

            <Footer />
        </div>
    )
}

export default App