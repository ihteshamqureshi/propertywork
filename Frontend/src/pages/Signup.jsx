import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Home, CheckCircle, Headphones, User, Mail, Lock, LogIn } from "lucide-react";






function Signup() {

    const navigate = useNavigate();

    const leftRef = useRef(null);
    const rightRef = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");



    // ANIMATION
    useEffect(() => {
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

            const res = await api.post("/signup", {
                name,
                email,
                password,
            });

            console.log("API RESPONSE:", res.data);

            if (res.data.success) {
                navigate("/login");
            } else {
                setMsg(res.data.message || "Signup failed");
            }

        } catch (error) {
            console.log("ERROR:", error);
            setMsg(
                error.response?.data?.message || "Server error"
            );
        }
    };




    return (



        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative px-4 py-8">

            {/* Property Themed Background - Building/House Patterns */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white/20 rounded-lg"></div>
                <div className="absolute bottom-32 right-20 w-48 h-48 border-2 border-white/20 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white/10 rounded-md"></div>
            </div>

            {/* GLOW EFFECTS - Blue + Purple Theme */}
            <div className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full bottom-0 right-0"></div>

            {/* MAIN CARD - Real Estate Style */}
            <div className="relative z-10 w-full max-w-[1000px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                <div className="flex flex-col md:flex-row">

                    {/* LEFT SECTION - Property Highlights */}
                    <div
                        ref={leftRef}
                        className="w-full md:w-[45%] bg-gradient-to-br from-blue-900/40 to-purple-900/80 p-8 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Home className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-blue-400 font-semibold text-lg">PropertyVista</span>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">
                                Find Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dream Property</span>
                            </h2>

                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                Join thousands of happy homeowners who found their perfect space with us.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-gray-300 text-sm">
                                    <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <span>10,000+ Properties Available</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 text-sm">
                                    <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-purple-400" />
                                    </div>
                                    <span>Verified Listings Only</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 text-sm">
                                    <div className="w-5 h-5 bg-indigo-500/20 rounded-full flex items-center justify-center">
                                        <Headphones className="w-3 h-3 text-indigo-400" />
                                    </div>
                                    <span>24/7 Expert Support</span>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="border-t border-white/10 pt-6">
                            <p className="text-gray-400 text-xs italic">
                                "Found my dream home in just 2 weeks! Amazing platform."
                            </p>
                            <p className="text-blue-400 text-xs font-semibold mt-2">
                                — Sarah Johnson
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SECTION - SIGNUP FORM */}
                    <div
                        ref={rightRef}
                        className="w-full md:w-[55%] p-8 md:p-10 bg-white/5"
                    >
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-gray-400 text-sm">Start your property journey today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 outline-none text-white placeholder-gray-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 outline-none text-white placeholder-gray-500 focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 outline-none text-white placeholder-gray-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-white"
                            >
                                Sign Up 
                            </button>

                            <p className="text-sm text-gray-400 text-center">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-400 hover:underline font-medium inline-flex items-center gap-1">
                                    <LogIn className="w-3 h-3" />
                                    Login
                                </Link>
                            </p>

                            {msg && (
                                <p className="text-center text-sm text-red-400 bg-red-500/10 py-2 rounded-lg">
                                    {msg}
                                </p>
                            )}

                            <p className="text-xs text-gray-500 text-center">
                                By signing up, you agree to our Terms & Conditions
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>








    );
}

export default Signup;