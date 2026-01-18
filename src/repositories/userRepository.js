const User = require('../models/User');

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async findById(userId) {
    return await User.findById(userId);
  }

  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async userExists(email) {
    const user = await User.findOne({
      email,
    });
    return !!user;
  }
}

module.exports = new UserRepository();
