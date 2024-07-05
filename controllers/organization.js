const db = require("../models");

const getUserOrganizations = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await db.User.findByPk(userId, {
      include: db.Organization,
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
      message: "Organizations retrieved successfully",
      data: {
        organizations: user.Organizations,
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

const createOrganization = async (req, res) => {
  const { name, description } = req.body;
  const { userId } = req.user;

  try {
    const organization = await db.Organization.create({
      orgId: userId,
      name,
      description,
    });

    const user = await db.User.findByPk(userId);
    await user.addOrganization(organization);

    res.status(201).json({
      status: "success",
      message: "Organization created successfully",
      data: {
        orgId: organization.orgId,
        name: organization.name,
        description: organization.description,
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

module.exports = { getUserOrganizations, createOrganization };
