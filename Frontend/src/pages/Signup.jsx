import {
    Home,
    CheckCircle,
    Headphones,
    User,
    Mail,
    Lock,
    LogIn,

} from "lucide-react";
import api from "../services/api";

import { useState, useEffect, useRef } from "react";
import { useNavigate, } from "react-router-dom";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();

    const leftRef = useRef(null);
    const rightRef = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // ANIMATION (SAFE)
    useEffect(() => {
        if (leftRef.current && rightRef.current) {
            gsap.fromTo(
                leftRef.current,
                { x: -60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            );

            gsap.fromTo(
                rightRef.current,
                { x: 60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, delay: 0.2 }
            );
        }
    }, []);

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        if (!name || !email || !password) {
            setMsg("All fields are required");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/auth/signup", {
                name,
                email,
                password,
            });

            if (res.data.success) {
                navigate("/login");
            } else {
                setMsg(res.data.message || "Signup failed");
            }
        } catch (error) {
            setMsg(error.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative px-4 py-8">

            {/* BACKGROUND */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-lg"></div>
                <div className="absolute bottom-32 right-20 w-48 h-48 border border-white/20 rounded-lg"></div>
            </div>

            {/* MAIN CARD */}
            <div className="relative z-10 w-full max-w-[1000px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

                <div className="flex flex-col md:flex-row">

                    {/* LEFT */}
                    <div
                        ref={leftRef}
                        className="w-full md:w-[45%] bg-gradient-to-br from-blue-900/40 to-purple-900/80 p-8 text-white"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Home className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-bold">PropertyVista</span>
                        </div>

                        <h2 className="text-3xl font-bold mb-4">
                            Find Your Dream Property
                        </h2>

                        <p className="text-gray-300 text-sm mb-6">
                            Join thousands of users
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-blue-400" />
                                Verified Listings
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Headphones className="w-4 h-4 text-purple-400" />
                                24/7 Support
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div
                        ref={rightRef}
                        className="w-full md:w-[55%] p-8 md:p-10 bg-white/5"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Start your journey
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* NAME */}
                            <div>
                                <label className="text-sm text-gray-300">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white"
                                        placeholder="Enter name"
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="text-sm text-gray-300">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white"
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="text-sm text-gray-300">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 py-3 bg-slate-800/50 border border-gray-700 rounded-lg text-white"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>

                            {/* BUTTON */}
                            <button
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Sign Up"}
                            </button>

                            {/* LOGIN LINK */}
                            <p className="text-sm text-gray-400 text-center">
                                Already have account?{" "}
                                <Link to="/login" className="text-blue-400">
                                    Login
                                </Link>
                            </p>

                            {/* ERROR */}
                            {msg && (
                                <p className="text-red-400 text-sm text-center">{msg}</p>
                            )}
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );

}

export default Signup;