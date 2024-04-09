import User from "../model/user.model.js";

const getAllUsersController = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user.role === "admin") {
      const users = await User.find();
      res.json(users);
    } else {
      res.status(403).json({ message: "Unauthorised access" });
    }
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserController = async (req, res) => {
  try {
    const userId = ree.user._id;
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    const { password, ...profileWithoutPassword } = userProfile.toObject();
    res.json({ userProfile: profileWithoutPassword });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getUserProfileController,
  updateUserController,
  getAllUsersController,
};
