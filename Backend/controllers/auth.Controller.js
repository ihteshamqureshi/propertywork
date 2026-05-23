// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";



// // SIGNUP
// export const signup = async (req, res) => {

//     try {

//         const { name, email, password, role } = req.body;

//         // CHECK EXISTING USER
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email already registered",
//             });
//         }

//         // HASH PASSWORD
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // CREATE USER
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });

//         // CREATE TOKEN
//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 role: user.role,
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "7d",
//             }
//         );

//         // SAVE TOKEN IN COOKIE
//         res.cookie("token", token, {
//             httpOnly: true,
//             sameSite: "lax",
//             secure: false,
//         });

//         // RESPONSE
//         return res.status(201).json({
//             success: true,
//             message: "Signup successful",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//             },
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }

// };



// // LOGIN
// export const login = async (req, res) => {

//     try {

//         const { email, password } = req.body;

//         // FIND USER
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         // CHECK PASSWORD
//         const isPasswordMatch = await bcrypt.compare(
//             password,
//             user.password
//         );

//         if (!isPasswordMatch) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid credentials",
//             });
//         }

//         // TOKEN
//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 role: user.role,
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "7d",
//             }
//         );

//         // COOKIE
//         res.cookie("token", token, {
//             httpOnly: true,
//             sameSite: "lax",
//             secure: false,
//         });

//         // RESPONSE
//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//             },
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }

// };



// // LOGOUT
// export const logout = async (req, res) => {

//     res.clearCookie("token");

//     return res.status(200).json({
//         success: true,
//         message: "Logout successful",
//     });

// };



// // CURRENT USER
// export const getMe = async (req, res) => {

//     try {

//         const user = await User.findById(req.user.id)
//             .select("-password");

//         return res.status(200).json({
//             success: true,
//             user,
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }

// };












import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user", // Default role
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // production mein true karna
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send response
        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= LOGIN =================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= LOGOUT =================
export const logout = (req, res) => {
    res.clearCookie("token");

    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};

// ================= GET CURRENT USER =================
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};