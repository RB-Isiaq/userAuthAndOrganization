const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config.json");
const nodemailer = require("nodemailer");
const { User } = require("../helpers/db");
const { default: mongoose } = require("mongoose");
const Role = require("../helpers/role");

const login = async (userParams) => {
  const { email, password } = userParams;
  const user = await User.findOne({ email: email });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
      expiresIn: "7d",
    });
    return { ...user.toJSON(), token };
  }
};

const getAll = async () => await User.find();

const getById = async (id) => await User.findById(id);
const deleteUser = async (id) => await User.findByIdAndDelete(id);

const create = async (user) => {
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser)
    throw new Error(`User ${existingUser.email} already exists.`);
  const newUser = new User(user);
  if (user.password) {
    newUser.password = bcrypt.hashSync(user.password, 10);
  }

  //   await newUser.save({role: 'user'});
  await newUser.save();
};

const update = async (id, userParam) => {
  // Validate that 'id' is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw "Invalid user ID.";
  }

  // Retrieve the existing user from the database
  const existingUser = await User.findById(id);
  if (!existingUser) {
    throw "User not found.";
  }

  // Check if the updated email already exists for another user
  if (userParam.email && existingUser.email !== userParam.email) {
    const userWithEmail = await User.findOne({ email: userParam.email });
    if (userWithEmail) {
      throw `User with email ${userParam.email} already exists.`;
    }
  }

  // Hash the password if it's included in the update parameters
  if (userParam.password) {
    userParam.password = bcrypt.hashSync(userParam.password, 10);
  }

  // Update the user object with the new parameters and save to the database
  Object.assign(existingUser, userParam);
  await existingUser.save();
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Send email with token (simplified)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    to: email,
    from: "passwordreset@bigTech.com",
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://localhost:3000/reset?jwt=${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).send("Error sending email");
    }
    // Only send the response once, after the email is sent
    res.status(200).send("Password reset email sent");
  });
};

const resetPassword = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).send("Authorization header is missing");
  }
  const { token } = req.params;
  const bearerToken = authHeader.split(" ")[1];
  const { password } = req.body;

  try {
    const decoded = jwt.verify(bearerToken || token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).send("User not found");
    }

    user.password = bcrypt.hashSync(password, 10);
    await user.save();

    res.status(200).send("Password has been reset");
  } catch (err) {
    return res
      .status(400)
      .send("Password reset token is invalid or has expired");
  }
};

module.exports = {
  login,
  create,
  update,
  getAll,
  getById,
  deleteUser,
  forgetPassword,
  resetPassword,
};
