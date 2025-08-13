const express = require('express');
const router = express.Router();
const compilerController = require('../controllers/compilerController');

/**
 * @route POST /api/compiler/compile
 * @desc Compile C++ code
 * @access Public
 */
router.post('/compile', compilerController.compile);

/**
 * @route POST /api/compiler/execute
 * @desc Execute compiled C++ code
 * @access Public
 */
router.post('/execute', compilerController.execute);

/**
 * @route DELETE /api/compiler/cleanup/:id
 * @desc Clean up temporary files
 * @access Public
 */
router.delete('/cleanup/:id', compilerController.cleanup);

module.exports = router;
