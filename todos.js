const db = require('./db-config');

const getTodos = async (userId) => {
    return db('todos').where({ user_id: userId });
};

const addTodo = async (userId, todo) => {
    const [id] = await db('todos').insert({ user_id: userId, text: todo.text, completed: todo.completed || false });
    return db('todos').where({ id }).first();
}

const markTodoCompleted = async (userId, todoId) => {
    const todo = await db('todos').where({ id: todoId, user_id: userId }).first();
    if (!todo) return null;
    await db('todos').where({ id: todoId }).update({ completed: true });
    return db('todos').where({ id: todoId }).first();
}

const deleteTodo = async (userId, todoId) => {
    const todo = await db('todos').where({ id: todoId, user_id: userId }).first();
    if (!todo) return null;
    await db('todos').where({ id: todoId }).del();
    return todo;
}

module.exports = {
    getTodos,
    addTodo,
    markTodoCompleted,
    deleteTodo
};