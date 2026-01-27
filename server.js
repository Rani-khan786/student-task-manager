const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors()); // Allow cross-origin requests (useful if frontend run separately, though here we serve static)
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static frontend files

// Utility: Read Tasks
const readTasks = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error("Error reading tasks:", err);
        return [];
    }
};

// Utility: Write Tasks
const writeTasks = (tasks) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error("Error writing tasks:", err);
    }
};

// Endpoint: List Tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Endpoint: Add Task
app.post('/tasks', (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Task text is required' });
    }

    const tasks = readTasks();

    // Create new task object with Human-Readable Timestamp
    // Using a simple yet reliable date format
    const now = new Date();
    const readableTimestamp = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const newTask = {
        id: Date.now(),
        text: text.trim(),
        timestamp: readableTimestamp
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let tasks = readTasks();
    const initialLength = tasks.length;

    tasks = tasks.filter(task => task.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ error: 'Task not found' });
    }

    writeTasks(tasks);
    res.status(200).json({ message: 'Task deleted successfully' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    // Initialize empty tasks file if it doesn't exist
    if (!fs.existsSync(DATA_FILE)) {
        writeTasks([]);
        console.log("Initialized tasks.json");
    }
});
