

// const roleMiddleware = (...roles) => {

//   return (req, res, next) => {

//     if (!roles.includes(req.user.role)) {

//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });

//     }

//     next();

//   };

// };

// export default roleMiddleware;




const adminMiddleware = (req, res, next) => {
  // Check if user exists (auth middleware se aana chahiye)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login first.",
    });
  }

  // Check if user has admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};

export default adminMiddleware;