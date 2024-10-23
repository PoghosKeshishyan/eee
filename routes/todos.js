const express = require('express');
const { getTodos, createTodo, updateTodoStatus, deleteTodo } = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// router.get('/', protect, getTodos);
// router.post('/', protect, createTodo);
// router.delete('/:id', protect, deleteTodo);


router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodoStatus);
router.delete('/:id', deleteTodo);


module.exports = router;
