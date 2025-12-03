import {
  createEditorialUseCase,
  updateEditorialUseCase,
  deleteEditorialUseCase,
  getEditorialUseCase,
  addHintUseCase,
  updateHintUseCase,
  deleteHintUseCase,
  getHintsUseCase
} from '../../library/domain/editorial/editorialUseCase.js';

class EditorialService {
  async createEditorial(problemId, data, userId) {
    return await createEditorialUseCase.execute(problemId, data, userId);
  }

  async updateEditorial(editorialId, updates) {
    return await updateEditorialUseCase.execute(editorialId, updates);
  }

  async deleteEditorial(editorialId) {
    return await deleteEditorialUseCase.execute(editorialId);
  }

  async getEditorial(problemId) {
    return await getEditorialUseCase.execute(problemId);
  }

  async addHint(editorialId, hintData) {
    return await addHintUseCase.execute(editorialId, hintData);
  }

  async updateHint(hintId, updates) {
    return await updateHintUseCase.execute(hintId, updates);
  }

  async deleteHint(hintId) {
    return await deleteHintUseCase.execute(hintId);
  }

  async getHints(editorialId) {
    return await getHintsUseCase.execute(editorialId);
  }
}

export default new EditorialService();
