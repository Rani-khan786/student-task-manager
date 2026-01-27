document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Function to create HTML for a task item
    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <span class="task-time">🕒 ${task.timestamp}</span>
            </div>
            <button class="delete-btn" data-id="${task.id}">🗑️</button>
        `;
        return li;
    };

    // Helper to prevent XSS
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Event Delegation for Delete Button
    // This is more robust than inline onclick=deleteTask()
    taskList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (!id) return;

            // Removing confirm dialog to ensure it works instantly for the user
            // if (!confirm('Are you sure you want to delete this task?')) return;
            console.log("Attempting to delete task with ID:", id);

            try {
                const response = await fetch(`/tasks/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Failed to delete task');

                // Reload tasks to reflect changes
                loadTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
                alert("Could not delete task.");
            }
        }
    });

    // Load tasks from backend
    const loadTasks = async () => {
        try {
            const response = await fetch('/tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks');

            const tasks = await response.json();
            taskList.innerHTML = ''; // Clear current list

            tasks.forEach(task => {
                taskList.appendChild(createTaskElement(task));
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
            taskList.innerHTML = '<li style="color: red; text-align: center;">Error loading tasks. Is server running?</li>';
        }
    };

    // Add new task
    const addTask = async () => {
        const text = taskInput.value.trim();
        if (!text) {
            alert("Please enter a task!");
            return;
        }

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Failed to add task');

            const newTask = await response.json();

            // Append directly to list (SPA behavior)
            taskList.appendChild(createTaskElement(newTask));

            // Clear input
            taskInput.value = '';
            taskInput.focus();

        } catch (error) {
            console.error('Error adding task:', error);
            alert("Could not save task. Check console.");
        }
    };

    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);

    // Add task on "Enter" key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Initial Load
    loadTasks();
});
