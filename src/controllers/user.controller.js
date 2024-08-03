import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email || password)) {
    throw new ApiError(401, "Email and password is required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(402, "User already exists");
  }
  const user = await User.create({
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "please try again");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get details from req.body
  const { password, email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  //check in database if the username or email is present or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }
  //check for the password

  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid user Credentials");
  }
  //generate both access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  //send tokens in secure cookies
  const loggedInUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  //send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Successfully LoggedIn"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //find the user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User loggedout successfully"));
});

export { registerUser, loginUser, logoutUser };
