import editorialRepository from './editorialRepository.js';
import { editorialMessages } from '../../../constant/userMessages.js';

class CreateEditorialUseCase {
  async execute(problemId, data, userId) {
    // Check if editorial already exists
    const exists = await editorialRepository.exists(problemId);
    if (exists) {
      throw new Error(editorialMessages.editorialExists);
    }

    // Validate data
    if (!data.title || !data.content) {
      throw new Error('Title and content are required');
    }

    return await editorialRepository.create({
      ...data,
      problemId,
      createdBy: userId
    });
  }
}

class UpdateEditorialUseCase {
  async execute(editorialId, updates) {
    const editorial = await editorialRepository.findById(editorialId);
    if (!editorial) {
      throw new Error(editorialMessages.editorialNotFound);
    }

    const allowedUpdates = {};
    if (updates.title !== undefined) allowedUpdates.title = updates.title;
    if (updates.content !== undefined) allowedUpdates.content = updates.content;
    if (updates.approach !== undefined) allowedUpdates.approach = updates.approach;
    if (updates.complexity !== undefined) allowedUpdates.complexity = updates.complexity;
    if (updates.codeExamples !== undefined) allowedUpdates.codeExamples = updates.codeExamples;
    if (updates.relatedTopics !== undefined) allowedUpdates.relatedTopics = updates.relatedTopics;
    if (updates.isPublished !== undefined) allowedUpdates.isPublished = updates.isPublished;

    return await editorialRepository.update(editorialId, allowedUpdates);
  }
}

class DeleteEditorialUseCase {
  async execute(editorialId) {
    const editorial = await editorialRepository.findById(editorialId);
    if (!editorial) {
      throw new Error(editorialMessages.editorialNotFound);
    }

    return await editorialRepository.delete(editorialId);
  }
}

class GetEditorialUseCase {
  async execute(problemId) {
    const editorial = await editorialRepository.findByProblemId(problemId);
    if (!editorial) {
      throw new Error(editorialMessages.editorialNotFound);
    }
    return editorial;
  }
}

class AddHintUseCase {
  async execute(editorialId, hintData) {
    const editorial = await editorialRepository.findById(editorialId);
    if (!editorial) {
      throw new Error(editorialMessages.editorialNotFound);
    }

    // Check hint count limit
    const hintCount = await editorialRepository.countHints(editorialId);
    if (hintCount >= 5) {
      throw new Error(editorialMessages.maxHintsReached);
    }

    // Validate order
    if (hintData.orderIndex < 1 || hintData.orderIndex > 5) {
      throw new Error(editorialMessages.hintOrderInvalid);
    }

    return await editorialRepository.createHint(editorialId, hintData);
  }
}

class UpdateHintUseCase {
  async execute(hintId, updates) {
    const hint = await editorialRepository.findHintById(hintId);
    if (!hint) {
      throw new Error(editorialMessages.hintNotFound);
    }

    const allowedUpdates = {};
    if (updates.content !== undefined) allowedUpdates.content = updates.content;
    if (updates.orderIndex !== undefined) {
      if (updates.orderIndex < 1 || updates.orderIndex > 5) {
        throw new Error(editorialMessages.hintOrderInvalid);
      }
      allowedUpdates.orderIndex = updates.orderIndex;
    }
    if (updates.penalty !== undefined) allowedUpdates.penalty = updates.penalty;

    return await editorialRepository.updateHint(hintId, allowedUpdates);
  }
}

class DeleteHintUseCase {
  async execute(hintId) {
    const hint = await editorialRepository.findHintById(hintId);
    if (!hint) {
      throw new Error(editorialMessages.hintNotFound);
    }

    return await editorialRepository.deleteHint(hintId);
  }
}

class GetHintsUseCase {
  async execute(editorialId) {
    const editorial = await editorialRepository.findById(editorialId);
    if (!editorial) {
      throw new Error(editorialMessages.editorialNotFound);
    }

    return await editorialRepository.getHints(editorialId);
  }
}

// Initialize use cases
export const createEditorialUseCase = new CreateEditorialUseCase();
export const updateEditorialUseCase = new UpdateEditorialUseCase();
export const deleteEditorialUseCase = new DeleteEditorialUseCase();
export const getEditorialUseCase = new GetEditorialUseCase();
export const addHintUseCase = new AddHintUseCase();
export const updateHintUseCase = new UpdateHintUseCase();
export const deleteHintUseCase = new DeleteHintUseCase();
export const getHintsUseCase = new GetHintsUseCase();
