import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };


    } catch (error) {
        throw new ApiError(500, "Error generating tokens")

    } y
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, "User already exists with this email");
        }

        const user = await new User({ name, email, password }).save();
        if (!user) {
            throw new ApiError(500, "User creation failed while registering");
        }




        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email && !password) {
            throw new ApiError(400, "Email and password are required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found, please register");
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const { accessToken, refreshToken } = await generateTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httponly: true,
            secure: true,
        }

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json({
                success: true,
                message: "User logged in successfully",
                accessToken,
                refreshToken,
                user: loggedInUser,
            });

    }
    catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1 
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json ({
                success: true,
                message: "User logged out successfully",
            });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error",
        });

    }
}


export { registerUser, loginUser, logoutUser };




