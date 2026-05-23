

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
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};

export default adminMiddleware;