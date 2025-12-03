import editorialService from '../../services/dashboard/editorial.service.js';
import { editorialMessages } from '../../constant/userMessages.js';

// Create editorial for a problem
const createEditorial = async (req, res) => {
  try {
    const { problemId } = req.params;
    const data = req.body;
    const userId = req.user.id;

    const editorial = await editorialService.createEditorial(problemId, data, userId);

    res.status(201).json({
      success: true,
      message: editorialMessages.editorialCreatedSuccess,
      data: editorial
    });
  } catch (error) {
    console.error('Create editorial error:', error);
    const statusCode = error.message === editorialMessages.editorialExists ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Get editorial for a problem
const getEditorial = async (req, res) => {
  try {
    const { problemId } = req.params;
    const editorial = await editorialService.getEditorial(problemId);

    res.status(200).json({
      success: true,
      message: editorialMessages.editorialFetchedSuccess,
      data: editorial
    });
  } catch (error) {
    console.error('Get editorial error:', error);
    const statusCode = error.message === editorialMessages.editorialNotFound ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Update editorial
const updateEditorial = async (req, res) => {
  try {
    const { editorialId } = req.params;
    const updates = req.body;

    const editorial = await editorialService.updateEditorial(editorialId, updates);

    res.status(200).json({
      success: true,
      message: editorialMessages.editorialUpdatedSuccess,
      data: editorial
    });
  } catch (error) {
    const statusCode = error.message === editorialMessages.editorialNotFound ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Delete editorial
const deleteEditorial = async (req, res) => {
  try {
    const { editorialId } = req.params;
    await editorialService.deleteEditorial(editorialId);

    res.status(200).json({
      success: true,
      message: editorialMessages.editorialDeletedSuccess
    });
  } catch (error) {
    const statusCode = error.message === editorialMessages.editorialNotFound ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Add hint to editorial
const addHint = async (req, res) => {
  try {
    const { editorialId } = req.params;
    const hintData = req.body;

    const hint = await editorialService.addHint(editorialId, hintData);

    res.status(201).json({
      success: true,
      message: editorialMessages.hintCreatedSuccess,
      data: hint
    });
  } catch (error) {
    const statusCode = error.message === editorialMessages.editorialNotFound ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Get hints for editorial
const getHints = async (req, res) => {
  try {
    const { editorialId } = req.params;
    const hints = await editorialService.getHints(editorialId);

    res.status(200).json({
      success: true,
      message: editorialMessages.hintsFetchedSuccess,
      data: hints
    });
  } catch (error) {
    const statusCode = error.message === editorialMessages.editorialNotFound ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Update hint
const updateHint = async (req, res) => {
  try {
    const { hintId } = req.params;
    const updates = req.body;

    const hint = await editorialService.updateHint(hintId, updates);

    res.status(200).json({
      success: true,
      message: editorialMessages.hintUpdatedSuccess,
      data: hint
    });
  } catch (error) {
    const statusCode = error.message === editorialMessages.hintNotFound ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Delete hint
const deleteHint = async (req, res) => {
  try {
    const { hintId } = req.params;
    await editorialService.deleteHint(hintId);

    res.status(200).json({
      success: true,
      message: editorialMessages.hintDeletedSuccess
    });
  } catch (error) {
    const statusCode = error.message === editorialMessages.hintNotFound ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  createEditorial,
  getEditorial,
  updateEditorial,
  deleteEditorial,
  addHint,
  getHints,
  updateHint,
  deleteHint
};
