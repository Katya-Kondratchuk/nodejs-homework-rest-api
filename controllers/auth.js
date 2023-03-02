const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

require("dotenv").config();

const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, subscription, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `Email ${email} in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const result = await User.create({
    subscription,
    email,
    password: hashPassword,
    avatarURL,
  });

  res.json({
    email: result.email,
    subscription: "starter",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;

  res.json({
    email,
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });

  res.json({
    message: "No Content",
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError("400", "avatar must be exist");
  }
  const { path: tempUpload, originalname } = req.file;
  try {
    const avatarImg = await Jimp.read(tempUpload);
    avatarImg.resize(250, 250).write(tempUpload);
  } catch (err) {
    throw HttpError(500);
  }
  const { _id } = req.user;
  const extenstion = originalname.split(".").pop();
  const filename = `${_id}_avatar.${extenstion}`;
  const resultUpload = path.join(avatarDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
