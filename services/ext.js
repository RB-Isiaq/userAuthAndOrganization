const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const express = require("express");
const { User } = require("../helpers/db");
const app = express();
app.use(express.json());

// Route to request a password reset
app.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = crypto.randomBytes(20).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour

  user.resetPasswordToken = token;
  user.resetPasswordExpires = resetTokenExpiry;
  await user.save();

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
            http://localhost:3000/reset/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).send("Error sending email");
    }
    res.status(200).send("Password reset email sent");
  });
});

// Route to reset the password
app.post("/reset", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).send("Authorization header is missing");
  }

  const bearerToken = authHeader.split(" ")[1];
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: bearerToken || token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .send("Password reset token is invalid or has expired");
  }

  user.password = bcrypt.hashSync(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).send("Password has been reset");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
