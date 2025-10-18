import { useContext, useEffect, useState } from "react"
import { assets } from "../assets/assets"
import { User } from "lucide-react"
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {
    const [state, setState] = useState('Login');
    const { setShowLogin, backendURL, setToken, setUser } = useContext(AppContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Login') {
                const { data } = await axios.post(`${backendURL}/api/user/login`, { email, password });
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendURL}/api/user/register`, { name, email, password });
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <motion.form
                onSubmit={onSubmitHandler}
                className="relative bg-white p-10 rounded-xl text-slate-500"
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h1 className="text-center text-2xl text-neutral-700 font-medium">{state}</h1>

                <p className="text-sm text-center">
                    {
                        state === 'Login' ? 'Welcome back! Please sign in to continue' : 'Create your account to get started'
                    }
                </p>

                {
                    state !== 'Login' &&
                    <div className="border border-gray-300 px-6 py-2 flex items-center gap-2 rounded-full mt-5">
                        <User className="text-gray-400" width={15} />

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            required
                            className="outline-none text-sm"
                        />
                    </div>
                }

                <div className="border border-gray-300 px-6 py-2 flex items-center gap-2 rounded-full mt-4">
                    <img width={15} src={assets.email_icon} alt="email_icon" />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email id"
                        required
                        className="outline-none text-sm"
                    />
                </div>

                <div className="border border-gray-300 px-6 py-2 flex items-center gap-2 rounded-full mt-4">
                    <img width={15} src={assets.lock_icon} alt="lock_icon" />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="outline-none text-sm"
                    />
                </div>

                <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot password?</p>

                <button className="bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer">
                    {
                        state === 'Login' ? 'Login' : 'Create Account'
                    }
                </button>

                {
                    state === 'Login' ?
                        (
                            <p className="mt-5 text-center">Don't have an account?
                                <span onClick={() => setState('Sign up')} className="text-blue-600 cursor-pointer"> Sign up</span>
                            </p>
                        ) : (
                            <p className="mt-5 text-center">Already have an account?
                                <span onClick={() => setState('Login')} className="text-blue-600 cursor-pointer"> Login</span>
                            </p>
                        )
                }

                <img
                    onClick={() => setShowLogin(false)}
                    src={assets.cross_icon} alt="cross_icon"
                    className="absolute top-5 right-5 cursor-pointer"
                />
            </motion.form>
        </div>
    )
}

export default Login