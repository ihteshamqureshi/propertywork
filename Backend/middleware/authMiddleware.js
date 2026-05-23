// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {

//   try {

//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Please login first",
//       });
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     req.user = decoded;

//     next();

//   } catch (error) {

//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });

//   }

// };

// export default authMiddleware;







import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: "Please login first"
    });
  }

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = verified;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
};

export default authMiddleware;