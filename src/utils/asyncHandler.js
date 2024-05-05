const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// const asyncHandler = (fn) => async (req,res,next) => {
// try {
//     await fn(req,res,next)
// } catch (error) {
//     res.status(err.code || 502).json({
//         successs:false,
//         Message:err.message
//     })
// }

// }
