import {
  getUsersUseCase,
  getUserUseCase,
  updateUserUseCase,
  updateUserRoleUseCase,
  activateUserUseCase,
  deactivateUserUseCase,
  deleteUserUseCase
} from '../../library/domain/user/userUseCase.js';
import { userMessages } from '../../constant/userMessages.js';

class UserService {
  async getUsers(filters) {
    return await getUsersUseCase.execute(filters);
  }

  async getUser(userId) {
    return await getUserUseCase.execute(userId);
  }

  async updateUser(userId, updates, currentUserId) {
    return await updateUserUseCase.execute(userId, updates, currentUserId);
  }

  async updateRole(userId, role, currentUserId) {
    return await updateUserRoleUseCase.execute(userId, role, currentUserId);
  }

  async activateUser(userId, currentUserId) {
    return await activateUserUseCase.execute(userId, currentUserId);
  }

  async deactivateUser(userId, currentUserId) {
    return await deactivateUserUseCase.execute(userId, currentUserId);
  }

  async deleteUser(userId, currentUserId) {
    return await deleteUserUseCase.execute(userId, currentUserId);
  }
}

export default new UserService();
