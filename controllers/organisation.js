const db = require("../models");

const getOrganisationById = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.user;

  try {
    const organisation = await db.Organisation.findByPk(orgId, {
      include: {
        model: db.User,
        as: "Users",
        attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        through: { attributes: [] },
      },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    const organisationUsers = organisation.Users.map((user) => user.userId);

    const isUserBelongsToOrganisation = organisationUsers.includes(userId);

    if (!isUserBelongsToOrganisation) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not authorized to access this organisation.",
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: {
        organisation,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

const getUserOrganisations = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await db.User.findByPk(userId, {
      include: {
        model: db.Organisation,
        as: "Organisations",
        attributes: { exclude: ["createdAt", "updatedAt"] },
        through: { attributes: [] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: {
        organisations: user.Organisations,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;
  const { userId } = req.user;

  try {
    const organisation = await db.Organisation.create({
      name,
      description,
    });
    const user = await db.User.findByPk(userId);
    await user.addOrganisation(organisation);

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    console.error(error.message, "error");
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

const addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      status: "Bad Request",
      message: "User ID is required",
      statusCode: 400,
    });
  }

  if (!orgId) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Organization ID is required",
      statusCode: 400,
    });
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    const organisation = await db.Organisation.findByPk(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: "Not Found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    await organisation.addUser(user);

    res.status(201).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    console.error(error.message, "error");
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

module.exports = {
  getOrganisationById,
  getUserOrganisations,
  createOrganisation,
  addUserToOrganisation,
};
