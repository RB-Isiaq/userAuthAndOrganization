const db = require("../models");

const getUser = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "Bad Request",
      message: "User ID is required",
      statusCode: 400,
    });
  }
  try {
    const loggedInUser = await db.User.findByPk(userId, {
      include: {
        model: db.Organisation,
        attributes: ["orgId"],
        through: { attributes: [] },
      },
    });
    console.log(loggedInUser, "loggedInUser fetch");

    const organisationIds = loggedInUser.Organisations.map((org) => org.orgId);

    const user = await db.User.findByPk(id, {
      include: {
        model: db.Organisation,
        attributes: ["orgId"],
        through: { attributes: [] },
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    const userOrganisationIds = user.Organisations.map((org) => org.orgId);
    const isSameOrganisation = userOrganisationIds.some((orgId) =>
      organisationIds.includes(orgId)
    );
    if (!isSameOrganisation) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not authorized to access this user.",
        statusCode: 403,
      });
    }
    const { Organisations, ...rest } = user.toJSON();

    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: rest,
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "Bad Request",
      message: "User ID is required",
      statusCode: 400,
    });
  }
  try {
    const user = await db.User.findByPk(id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
    console.log(user, "user fetch");

    if (!user) {
      return res.status(404).json({
        status: "Not Found",
        message: "User not found",
        statusCode: 404,
      });
    }

    await user.destroy();
    res.status(200).json({
      status: "deleted",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

module.exports = { getUser, deleteUser };
