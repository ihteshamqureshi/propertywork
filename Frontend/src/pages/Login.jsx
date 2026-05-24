


import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";



import { Home, Eye, EyeOff, UserPlus, Mail, Lock } from "lucide-react"; 




function Login() {




    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false); 

    const cardRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    const navigate = useNavigate();





    // ANIMATION
    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
        );

        gsap.fromTo(
            leftRef.current,
            { x: -40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, delay: 0.3 }
        );

        gsap.fromTo(
            rightRef.current,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, delay: 0.5 }
        );
    }, []);





    // LOGIN
    const handleSubmit = async (e) => {




        e.preventDefault(); 


        
        setMsg("");

        if (!email || !password) {
            setMsg("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            if (res.data.success) {
                navigate("/");
            } else {
                setMsg(res.data.message || "Login failed");
            }
        } catch (error) {
            setMsg(error.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }



    };






    return (



        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative px-4 py-8">



            {/* Property Themed Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 border-2 border-white/20 rounded-lg"></div>
                <div className="absolute bottom-32 right-20 w-48 h-48 border-2 border-white/20 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white/10 rounded-md"></div>
            </div>




            {/* GLOW EFFECTS */}
            <div className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full"></div>
            <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full bottom-0 right-0"></div>







            {/* MAIN CARD */}
            <div
                ref={cardRef}
                className="relative z-10 w-full max-w-[1000px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >



                <div className="flex flex-col md:flex-row">



                    {/* LEFT SECTION - LOGIN FORM */}
                    <div
                        ref={leftRef}
                        className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-white bg-white/5"
                    >




                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Home className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-blue-400 font-semibold">PropertyVista</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Welcome Back! 👋</h2>
                            <p className="text-gray-400 text-sm">Login to access your property dashboard</p>
                        </div>




                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 outline-none text-white placeholder-gray-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>





                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-12 outline-none text-white placeholder-gray-500 focus:border-purple-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-500 hover:text-gray-300 transition-colors" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-500 hover:text-gray-300 transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>








                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>




                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Logging in..." : "LOGIN →"}
                            </button>

                            <p className="text-sm text-gray-400 text-center">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-blue-400 hover:underline font-medium inline-flex items-center gap-1">
                                    <UserPlus className="w-3 h-3" />
                                    Sign Up
                                </Link>
                            </p>

                            {msg && (
                                <p className="text-center text-sm text-red-400 bg-red-500/10 py-2 rounded-lg">
                                    {msg}
                                </p>


                            )}




                        </form>



                    </div>







                    {/* RIGHT SECTION - ILLUSTRATION */}
                    <div
                        ref={rightRef}
                        className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/80 p-8"
                    >


                        <div className="text-center">
                            <img
                                src="/login.png"
                                className="w-64 md:w-72 mx-auto opacity-90 mb-6"
                                alt="Property Illustration"
                            />
                            <div className="hidden md:block">
                                <h3 className="text-white text-xl font-semibold mb-2">Find Your Dream Home</h3>
                                <p className="text-gray-300 text-sm">Access thousands of verified properties</p>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>




                    </div>

                </div>


            </div>



        </div>




    );




}










export default Login;