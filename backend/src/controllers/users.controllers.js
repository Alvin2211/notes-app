import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

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

    }
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
        const { name, email, password } = req.body;

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
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: "strict", // Adjust based on your needs

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
            secure: "production" === process.env.NODE_ENV,
            sameSite: "strict",
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
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

const refreshAccessToken = async (req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            success: true,
            message: "Access token refreshed successfully",
            accessToken,
        })}
        catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

}
    

// Add this to users.controllers.js
const getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Current user fetched successfully",
            user: req.user  // This comes from verifyJWT middleware
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

// Export it
export { registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken };







