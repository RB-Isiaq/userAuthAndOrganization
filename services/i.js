const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const express = require("express");
const { User } = require("../helpers/db");
const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Make sure to set this in your environment variables

// Route to request a password reset
app.post("/forget-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

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
  const { token } = req.params;
  const bearerToken = authHeader.split(" ")[1];
  const { password } = req.body;

  try {
    const decoded = jwt.verify(bearerToken || token, JWT_SECRET);
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
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
