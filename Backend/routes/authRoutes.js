// import express from "express";

// import {
//   signup,
//   login,
//   logout,
//   getMe,
// } from "../controllers/authController.js";

// import authMiddleware from "../middlewares/authMiddleware.js";

// import roleMiddleware from "../middlewares/roleMiddleware.js";

// const router = express.Router();



// // PUBLIC ROUTES
// router.post("/signup", signup);

// router.post("/login", login);



// // PRIVATE ROUTES
// router.post(
//   "/logout",
//   authMiddleware,
//   logout
// );

// router.get(
//   "/me",
//   authMiddleware,
//   getMe
// );



// // ADMIN ROUTE
// router.get(
//   "/admin-dashboard",
//   authMiddleware,
//   roleMiddleware("admin"),
//   (req, res) => {

//     res.status(200).json({
//       success: true,
//       message: "Welcome Admin",
//     });

//   }
// );



// // AGENT + ADMIN ROUTE
// router.get(
//   "/manage-properties",
//   authMiddleware,
//   roleMiddleware("admin", "agent"),
//   (req, res) => {

//     res.status(200).json({
//       success: true,
//       message: "Property access granted",
//     });

//   }
// );

// export default router;











import express from "express";

import {
    signup,
    login,
    logout,
    getMe,
} from "../controllers/auth.Controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();



router.post("/signup", signup);
router.post("/login", login);



router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);


// ADMIN ONLY
router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Welcome Admin Panel",
        });
    }
);

export default router;
