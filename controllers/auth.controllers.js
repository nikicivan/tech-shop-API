import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const createOrUpdate = asyncHandler(async (req, res) => {
  const { name, picture, email } = req.user;

  // console.log(name, picture, email);

  const user = await User.findOneAndUpdate(
    { email },
    { name, picture },
    {
      new: true,
    },
  );

  if (user) {
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      picture,
    }).save();

    // console.log(newUser);

    res.status(201).json(newUser);
  }
});

export const currentUser = asyncHandler(async (req, res) => {
  User.findOne({ email: req.user.email }).exec((error, user) => {
    if (error) {
      throw new Error(error);
    }
    res.json(user);
  });
});
