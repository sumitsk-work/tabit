function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear current list

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.setAttribute('data-id', task.id);
        taskElement.setAttribute('draggable', true); // Make the task draggable
        taskElement.setAttribute('ondragstart', `drag(event, ${index})`);

        taskElement.innerHTML = `
            <div class="task-drag">
                <span class="drag-icon">⋮</span> <!-- Three dots for dragging -->
            </div>
            <div>
                <input type="text" class="task-name-input" id="task-name-${task.id}" value="${task.name}" placeholder="Task Name">
                <div>
                    <input type="number" class="task-duration-input" id="task-hours-${task.id}" value="${Math.floor(task.duration / 60)}" placeholder="Hours">
                    <input type="number" class="task-duration-input" id="task-minutes-${task.id}" value="${task.duration % 60}" placeholder="Minutes">
                </div>
                <span class="timer" id="timer-${task.id}">${formatTime(task.remainingTime)}</span>
            </div>
            <div class="button-group">
                <button onclick="toggleTimer(${task.id})">${task.timerRunning ? 'Stop' : 'Start'} Timer</button>
                <button class="edit-button" onclick="saveTask(${task.id})">Save</button>
                <button class="delete-button" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskElement);
    });
}

// Handle the drag and drop functionality to reorder tasks
function drag(event, index) {
    event.dataTransfer.setData("text", index);
}

document.getElementById('task-list').addEventListener('dragover', (event) => {
    event.preventDefault(); // Necessary to allow drop
});

document.getElementById('task-list').addEventListener('drop', (event) => {
    const fromIndex = event.dataTransfer.getData("text");
    const toIndex = event.target.closest('.task-item').getAttribute('data-id');
    swapTasks(fromIndex, toIndex);
});

function swapTasks(fromIndex, toIndex) {
    const task = tasks[fromIndex];
    tasks[fromIndex] = tasks[toIndex];
    tasks[toIndex] = task;
    renderTasks(); // Re-render tasks
}
