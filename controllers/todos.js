const Todo = require('../models/Todo');

// Получить все задачи пользователя
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching todos' });
    }
};

// Создать задачу
exports.createTodo = async (req, res) => {
    const { text } = req.body;
    try {
        const todo = new Todo({
            text,
            user: req.user._id,
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Error creating todo' });
    }
};

// Обновить статус задачи
exports.updateTodoStatus = async (req, res) => {
    try {
        // Найти задачу по id и обновить поле completed
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        // Переключить статус
        todo.completed = !todo.completed;
        
        // Сохранить изменения
        await todo.save();
        
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Error updating todo status' });
    }
};

// Удалить задачу
exports.deleteTodo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting todo' });
    }
};
