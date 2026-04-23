import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// controller for User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // setting user data in session
    req.session.isLoggedIn = true;
    req.session.userId = newUser._id;
    return res.json({
      message: "Account Created Successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// controller for user login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user doesn't exists" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid password" });
    }
    // setting user data in session
    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    return res.json({
      message: "Login Successfull",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//controller for user logout
export const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy((error: any) => {
    if (error) {
      console.log(error);
      return res.json(500).json({ message: "error.message" });
    }
  });
  return res.json({ message: "Logout successfull" });
};

//controller for verigfy user
export const verifyUser = async (req: Request, res: Response) => {
  try {
   const {userId} = req.session;
   const user = await User.findById(userId).select("-password")
   if(!user){
    return res.status(400).json({message:"invalid user"})
   }
   return res.json({user})

  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
