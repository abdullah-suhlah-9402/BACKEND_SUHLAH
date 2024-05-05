import { asyncHandler } from "../utils/asyncHandler.js";

const reqisterUser = asyncHandler(async (req, res) => {
  res.status(500).json({
    message: "SUHAIMA",
  });
});

export { reqisterUser };
