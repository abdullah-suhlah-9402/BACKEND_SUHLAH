import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const reqisterUser = asyncHandler(async (req, res) => {
  // res.status(500).json({
  //   message: "khihyfyfyyihi",
  // });

  // get user details from frontend posteman
  const { fullname, email, username, password } = req.body;
  console.log("email :", email);

  // validation -- not empty
  //   if (fullname === ""){     ---------old method
  // throw new ApiError(400, "Fullname is required")

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "fullname is required");
  }
  //   }

  // check if user already exists -- username or emaail

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(405, "already existeing user ");
  }

  // chekc for required images and avatar

  const avatarLocalpath = req.files?.avatar[0]?.path;
  const coverImageLocalpath = req.files?.avatar[0]?.path;

  if (!avatarLocalpath) {
    throw new ApiError(404, "avatar is must");
  }

  // upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalpath);
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);

  if (!avatar) {
    throw new ApiError(405, "avatar is required");
  }

  // create object user - create entry on db

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // remove password and refresg tokens

  const createdUser = await User.findById(user._id).select(
    "-password - refreshToken"
  );
  // check for user creation

  if (!createdUser) {
    throw new ApiError(500, "SOMETHING WENT WRONG WHILE REGISTERING THE USER");
  }
  // returm res

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "useer registered successfully"));
  //
});

export { reqisterUser };
