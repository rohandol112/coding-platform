import userService from '../../services/dashboard/user.service.js';
import { userMessages } from '../../constant/userMessages.js';

// Get all users with filters
const getUsers = async (req, res) => {
  try {
    const { page, limit, role, isActive, search, sortBy, sortOrder } = req.query;
    
    const filters = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? Math.min(parseInt(limit, 10), 100) : 20,
      role,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search,
      sortBy,
      sortOrder
    };

    const result = await userService.getUsers(filters);

    res.status(200).json({
      success: true,
      message: userMessages.usersFetchedSuccess,
      data: result
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user by ID
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUser(userId);

    res.status(200).json({
      success: true,
      message: userMessages.userFetchedSuccess,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    const statusCode = error.message === userMessages.userNotFound ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const currentUserId = req.user.id;

    const user = await userService.updateUser(userId, updates, currentUserId);

    res.status(200).json({
      success: true,
      message: userMessages.userUpdatedSuccess,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    const statusCode = error.message === userMessages.userNotFound ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Update user role
const updateRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const currentUserId = req.user.id;

    const user = await userService.updateRole(userId, role, currentUserId);

    res.status(200).json({
      success: true,
      message: userMessages.roleUpdatedSuccess,
      data: user
    });
  } catch (error) {
    const statusCode = error.message === userMessages.userNotFound ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Activate user
const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const user = await userService.activateUser(userId, currentUserId);

    res.status(200).json({
      success: true,
      message: userMessages.userActivatedSuccess,
      data: user
    });
  } catch (error) {
    const statusCode = error.message === userMessages.userNotFound ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Deactivate user
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const user = await userService.deactivateUser(userId, currentUserId);

    res.status(200).json({
      success: true,
      message: userMessages.userDeactivatedSuccess,
      data: user
    });
  } catch (error) {
    const statusCode = error.message === userMessages.userNotFound ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    await userService.deleteUser(userId, currentUserId);

    res.status(200).json({
      success: true,
      message: userMessages.userDeletedSuccess
    });
  } catch (error) {
    const statusCode = error.message === userMessages.userNotFound ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getUsers,
  getUser,
  updateUser,
  updateRole,
  activateUser,
  deactivateUser,
  deleteUser
};
