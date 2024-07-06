const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const { generateToken } = require("../utils");

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      errors: errors.array(),
    });
  }
  const { firstName, lastName, email, password, phone } = req.body;
  console.log(req.body, "req");

  try {
    const userExists = await db.User.findOne({
      where: {
        [Op.or]: [{ email }],
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

    const orgName = `${firstName}'s Organisation`;
    const organisation = await db.Organisation.create({
      orgId: user.dataValues.userId,
      name: orgName,
    });
    const r = await user.addOrganisation(organisation);
    const token = generateToken(user.toJSON());

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "Bad request",
      message: "Login unsuccessful",
      errors: errors.array(),
    });
  }
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

    const token = generateToken(user.toJSON());

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