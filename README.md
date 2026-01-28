# Student Task Manager

## 1. Project Title & Goal
**Task Manager is a local-only Single Page Application (SPA) designed to help students track their homework and assignments efficiently without relying on an external APIs or internet connectivity.**

## 2. Setup Instructions
Follow the steps below to run the project locally:
```bash
git clone <student-task-manager>
cd student-task-manager
npm install
node server.js
```
Open the application in your browser at:**http://localhost:3000**

## 3. The Logic (How I Thought)
### Why did you choose this approach?
I chose **Node.js** with **Express** for the backend to keep the entire project JavaScript-based, making it easy to understand and maintain. For the frontend, I intentionally used **Vanilla HTML, CSS, and JavaScript** instead of frameworks like React to strictly follow the requirement of simplicity and ensure the application runs locally without any build tools or complex setup.


**Communication:**To achieve SPA behavior, the frontend communicates with the backend using the `fetch() API`. Tasks are added, listed, and deleted dynamically by updating the DOM, ensuring the page never reloads and the user experience remains smooth.

**Storage:** For storage, I used a local `tasks.json` file instead of a database. This decision ensures full portability—the project can be cloned or zipped and will run instantly on any machine with Node.js installed.

### What was the hardest bug you faced, and how did you fix it?
The **"Ghost Task”** bug was the most challenging issue I faced. Initially, when deleting a task, it disappeared from the UI but reappeared after refreshing the page.

**Root Cause:**
I was only removing the task from the DOM without confirming that the backend had permanently removed it from storage.

**Solution:**
I fixed this by implementing a `DELETE /tasks/:id` API endpoint. After deletion, the updated task list is immediately written back to `tasks.json`. The frontend now refreshes its state only after receiving a successful server response, ensuring consistency between the UI and backend.

## 4. Output Screenshots (Project Workflow)

### Step 1: Initial View
A clean and student-friendly interface ready for task input.
![Initial View](screenshots/workflow_1.png)

### Step 2: Adding a Task
Type your task and hit "Add Task". The application processes it instantly.
![Adding Task](screenshots/workflow_2.png)

### Step 3: Managing Tasks
View your list with human-readable timestamps. You can delete completed tasks using the trash icon.
![Task List](screenshots/workflow_3.png)

## 5. Future Improvements
If I had two more days, I would implement:
-   **Task Editing:** Allow users to fix typos in their tasks.
-   **Task Status:**
This will allow to check whether a task is completed or pending.
-   **Filters:** Buttons to show only "Completed" or "Pending" tasks.
-   **Drag & Drop:** To reorder tasks based on priority.
-   **Dark Mode:** A toggle for better late-night coding sessions.
