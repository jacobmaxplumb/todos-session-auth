const db = require('./db-config');

// Get all todos for a user
const getTodos = async (userId) => {
    return db('todos').where({ user_id: userId });
};

// Add a todo for a user and return the inserted row
const addTodo = async (userId, todo) => {
    const [newTodo] = await db('todos')
        .insert({
            user_id: userId,
            text: todo.text,
            completed: todo.completed || false
        })
        .returning('*'); // Return the inserted row
    return newTodo;
};

// Mark a todo as completed for a user
const markTodoCompleted = async (userId, todoId) => {
    const todo = await db('todos').where({ id: todoId, user_id: userId }).first();
    if (!todo) return null;

    const [updatedTodo] = await db('todos')
        .where({ id: todoId })
        .update({ completed: true })
        .returning('*'); // Return the updated row

    return updatedTodo;
};

// Delete a todo for a user and return the deleted row
const deleteTodo = async (userId, todoId) => {
    const todo = await db('todos').where({ id: todoId, user_id: userId }).first();
    if (!todo) return null;

    await db('todos').where({ id: todoId }).del();
    return todo; // Return the original row before deletion
};

module.exports = {
    getTodos,
    addTodo,
    markTodoCompleted,
    deleteTodo
};
