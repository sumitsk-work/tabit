let taskId = 0; // Variable to track the task ID
let tasks = [];  // Array to hold tasks

// On page load, load the tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage(); // Load tasks from localStorage when page is loaded
});

// Add a new task
function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskDuration = parseInt(document.getElementById('task-duration').value);

    // Basic validation
    if (!taskName || isNaN(taskDuration) || taskDuration <= 0) {
        alert('Please enter valid task name and duration.');
        return;
    }

    // Create a new task object
    const newTask = {
        id: taskId++,  // Increment taskId for each new task
        name: taskName,
        duration: taskDuration,
        remainingTime: taskDuration * 60, // Duration in seconds
        timerRunning: false
    };

    tasks.push(newTask); // Add task to the tasks array
    saveTasksToLocalStorage(); // Save tasks to localStorage
    renderTasks(); // Render the tasks on the screen
    clearInputs(); // Clear input fields
}

// Render tasks on the screen
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';  // Clear the existing list

    tasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.setAttribute('data-id', task.id);

        taskElement.innerHTML = `
            <div class="task-content">
                <span class="task-name">${task.name}</span>
                <span class="task-duration">${task.duration} min</span>
                <span class="timer" id="timer-${task.id}">${formatTime(task.remainingTime)}</span>
            </div>
            <div class="button-group">
                <button onclick="toggleTimer(${task.id})">${task.timerRunning ? 'Stop' : 'Start'} Timer</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskElement); // Append task element to the task list
    });
}

// Format seconds into mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

// Start or stop the timer for a task
function toggleTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task.timerRunning) {
        clearInterval(task.timerInterval);
        task.timerRunning = false;
    } else {
        task.timerInterval = setInterval(() => {
            task.remainingTime--;
            document.getElementById(`timer-${task.id}`).innerText = formatTime(task.remainingTime);
            if (task.remainingTime <= 0) {
                clearInterval(task.timerInterval);
                task.timerRunning = false;
            }
        }, 1000);
        task.timerRunning = true;
    }
    renderTasks(); // Re-render tasks after toggling the timer
}

// Edit task name and duration
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const newName = prompt('Edit task name:', task.name);
    const newDuration = prompt('Edit task duration (in minutes):', task.duration);
    if (newName && newDuration) {
        task.name = newName;
        task.duration = parseInt(newDuration);
        task.remainingTime = task.duration * 60; // Reset remaining time
        renderTasks(); // Re-render tasks
    }
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(); // Save updated task list to localStorage
    renderTasks(); // Re-render tasks
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks as a string in localStorage
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks); // Parse the saved tasks
        taskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0; // Set taskId based on the last task ID
        renderTasks(); // Render tasks when the page is loaded
    }
}

// Clear input fields after adding a task
function clearInputs() {
    document.getElementById('task-name').value = '';
    document.getElementById('task-duration').value = '';
}

// Register Service Worker
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then((registration) => {
//                 console.log('Service Worker registered with scope:', registration.scope);
//             })
//             .catch((error) => {
//                 console.log('Service Worker registration failed:', error);
//             });
//     });
// }
