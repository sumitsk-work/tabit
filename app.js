// app.js

let taskId = 0;
let tasks = [];

function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskHours = parseInt(document.getElementById('task-hours').value);
    const taskMinutes = parseInt(document.getElementById('task-minutes').value);

    if (!taskName || isNaN(taskHours) || isNaN(taskMinutes)) {
        alert('Please enter both task name and duration');
        return;
    }

    const taskDuration = (taskHours * 60) + taskMinutes;

    const newTask = {
        id: taskId++,
        name: taskName,
        duration: taskDuration,
        remainingTime: taskDuration * 60, // in seconds
        timerRunning: false,
        editable: false,
    };

    tasks.push(newTask);
    renderTasks();
    clearInputs();
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear current list

    tasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.setAttribute('data-id', task.id);

        const editableClass = task.editable ? 'editable' : '';

        taskElement.innerHTML = `
            <div>
                <input type="text" class="task-name-input ${editableClass}" id="task-name-${task.id}" value="${task.name}" placeholder="Task Name" ${task.editable ? '' : 'readonly'}>
                <div>
                    <input type="number" class="task-duration-input ${editableClass}" id="task-hours-${task.id}" value="${Math.floor(task.duration / 60)}" placeholder="Hours" ${task.editable ? '' : 'readonly'}>
                    <input type="number" class="task-duration-input ${editableClass}" id="task-minutes-${task.id}" value="${task.duration % 60}" placeholder="Minutes" ${task.editable ? '' : 'readonly'}>
                </div>
                <span class="timer" id="timer-${task.id}">${formatTime(task.remainingTime)}</span>
            </div>
            <div class="button-group">
                <button onclick="toggleTimer(${task.id})">${task.timerRunning ? 'Stop' : 'Start'} Timer</button>
                <button class="edit-button" onclick="toggleEdit(${task.id})">${task.editable ? 'Save' : 'Edit'}</button>
                <button class="delete-button" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskElement);
    });
}

function toggleEdit(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.editable = !task.editable;
    renderTasks();
}

function saveTask(taskId) {
    const taskName = document.getElementById(`task-name-${taskId}`).value;
    const taskHours = parseInt(document.getElementById(`task-hours-${taskId}`).value);
    const taskMinutes = parseInt(document.getElementById(`task-minutes-${taskId}`).value);

    const task = tasks.find(t => t.id === taskId);
    task.name = taskName;
    task.duration = (taskHours * 60) + taskMinutes;  // Save duration in minutes

    task.remainingTime = task.duration * 60;  // Reset remaining time
    task.timerRunning = false;  // Reset timer status

    renderTasks();
}

function toggleTimer(taskId) {
    const task = tasks.find(t => t.id === taskId);

    if (task.timerRunning) {
        clearInterval(task.timerInterval); // Stop the timer
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

    renderTasks();  // Re-render tasks to reflect the updated timer state
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

function clearInputs() {
    document.getElementById('task-name').value = '';
    document.getElementById('task-hours').value = '';
    document.getElementById('task-minutes').value = '';
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('Service Worker registered: ', registration);
        }).catch((error) => {
            console.log('Service Worker registration failed: ', error);
        });
    });
}

