import userRepository from './userRepository.js';
import { userMessages } from '../../../constant/userMessages.js';

class GetUsersUseCase {
  async execute(filters) {
    const result = await userRepository.findMany(filters);
    return result;
  }
}

class GetUserUseCase {
  async execute(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(userMessages.userNotFound);
    }
    return user;
  }
}

class UpdateUserUseCase {
  async execute(userId, updates, currentUserId) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(userMessages.userNotFound);
    }

    // Only allow updating firstName, lastName, username, isVerified
    const allowedUpdates = {};
    if (updates.firstName !== undefined) allowedUpdates.firstName = updates.firstName;
    if (updates.lastName !== undefined) allowedUpdates.lastName = updates.lastName;
    if (updates.username !== undefined) allowedUpdates.username = updates.username;
    if (updates.isVerified !== undefined) allowedUpdates.isVerified = updates.isVerified;

    return await userRepository.update(userId, allowedUpdates);
  }
}

class UpdateUserRoleUseCase {
  async execute(userId, role, currentUserId) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(userMessages.userNotFound);
    }

    // Cannot update own role
    if (userId === currentUserId) {
      throw new Error(userMessages.cannotUpdateOwnRole);
    }

    // Validate role
    const validRoles = ['USER', 'ADMIN', 'MODERATOR'];
    if (!validRoles.includes(role)) {
      throw new Error(userMessages.invalidRole);
    }

    return await userRepository.updateRole(userId, role);
  }
}

class ActivateUserUseCase {
  async execute(userId, currentUserId) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(userMessages.userNotFound);
    }

    return await userRepository.updateStatus(userId, true);
  }
}

class DeactivateUserUseCase {
  async execute(userId, currentUserId) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(userMessages.userNotFound);
    }

    // Cannot deactivate self
    if (userId === currentUserId) {
      throw new Error(userMessages.cannotDeactivateSelf);
    }

    return await userRepository.updateStatus(userId, false);
  }
}

class DeleteUserUseCase {
  async execute(userId, currentUserId) {
    // Validate user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(userMessages.userNotFound);
    }

    // Cannot delete self
    if (userId === currentUserId) {
      throw new Error(userMessages.cannotDeleteSelf);
    }

    return await userRepository.delete(userId);
  }
}

// Initialize use cases
export const getUsersUseCase = new GetUsersUseCase();
export const getUserUseCase = new GetUserUseCase();
export const updateUserUseCase = new UpdateUserUseCase();
export const updateUserRoleUseCase = new UpdateUserRoleUseCase();
export const activateUserUseCase = new ActivateUserUseCase();
export const deactivateUserUseCase = new DeactivateUserUseCase();
export const deleteUserUseCase = new DeleteUserUseCase();
