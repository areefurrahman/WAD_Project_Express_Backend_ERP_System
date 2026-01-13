const userService = require("./user.service");

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

const getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.json(user);
};

const disableUser = async (req, res) => {
  const user = await userService.disableUser(req.params.id);
  res.json(user);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  disableUser
};
