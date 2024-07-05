const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  console.log(req.body, "req");

  try {
    const userExists = await db.User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (userExists) {
      const errors = [];
      if (userExists.email === email) {
        errors.push({ field: "email", message: "Email already in use" });
      }
      if (userExists.phone === phone) {
        errors.push({ field: "phone", message: "Phone number already in use" });
      }

      return res.status(422).json({ errors });
    }

    const user = await db.User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });
    console.log("created user", user.dataValues, "user");

    const orgName = `${firstName}'s Organization`;
    const organization = await db.Organization.create({
      orgId: user.dataValues.userId,
      name: orgName,
    });
    console.log(organization, "zation");
    const r = await user.addOrganization(organization);
    console.log(r, "rrr");

    const token = jwt.sign(
      { userId: user.dataValues.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log(token, token);
    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
};

module.exports = { register, login };
