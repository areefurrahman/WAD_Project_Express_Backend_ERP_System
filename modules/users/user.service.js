const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

const createUser = async (data) => {
  const { name, email, password, role } = data;

  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    name,
    email,
    password: hashedPassword,
    role
  });
};

const getAllUsers = async () => {
  return User.find().select("-password");
};

const getUserById = async (id) => {
  return User.findById(id).select("-password");
};

const updateUser = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
};

const disableUser = async (id) => {
  return User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).select("-password");
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  disableUser
};
