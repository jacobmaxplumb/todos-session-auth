const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const expressSession = require('express-session');
const { addUser, findByUsername } = require('./users');
const { getTodos, addTodo, markTodoCompleted, deleteTodo } = require('./todos');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use(expressSession({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    }
}));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const existingUser = await findByUsername(username);
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await addUser({ username, password: hashedPassword });
    res.status(201).json({ id: newUser.id, username: newUser.username });
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.session.user = { id: user.id, username: user.username };
    res.status(200).json({ message: 'Login successful' });
});

app.get('/todos', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const todos = await getTodos(req.session.user.id);
    res.status(200).json(todos);
})

app.post('/todos', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'Todo text is required' });
    }
    const newTodo = await addTodo(req.session.user.id, { text });
    res.status(201).json(newTodo);
});

app.patch('/todos/:id/complete', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const todoId = parseInt(req.params.id);
    const updatedTodo = await markTodoCompleted(req.session.user.id, todoId);
    if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const todoId = parseInt(req.params.id);
    const deletedTodo = await deleteTodo(req.session.user.id, todoId);
    if (!deletedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(deletedTodo);
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});