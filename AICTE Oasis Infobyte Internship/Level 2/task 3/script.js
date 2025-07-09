const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const saveBtn = document.getElementById('saveBtn');
const pendingTasks = document.getElementById('pendingTasks');
const completedTasks = document.getElementById('completedTasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editTaskId = null;

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  if (editTaskId) {
    updateTask();
  } else {
    addTask();
  }
});

function addTask() {
  const title = taskTitle.value.trim();
  const desc = taskDesc.value.trim();

  if (title === '' || desc === '') return;

  const task = {
    id: Date.now(),
    title,
    desc,
    status: 'Pending',
    createdAt: new Date().toLocaleString(),
    updatedAt: null,
    completedAt: null
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskForm.reset();
}

function renderTasks() {
  pendingTasks.innerHTML = '';
  completedTasks.innerHTML = '';

  tasks.forEach(task => {
    const row = document.createElement('tr');
    row.className = 'task-row';

    const titleCell = document.createElement('td');
    titleCell.textContent = task.title;

    const descCell = document.createElement('td');
    descCell.textContent = task.desc;

    const createdAtCell = document.createElement('td');
    createdAtCell.textContent = task.createdAt;

    const actionsCell = document.createElement('td');
    actionsCell.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.addEventListener('click', () => startEditTask(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    if (task.status === 'Pending') {
      const completeBtn = document.createElement('button');
      completeBtn.textContent = 'Mark Complete';
      completeBtn.className = 'complete-btn';
      completeBtn.addEventListener('click', () => markComplete(task.id));
      actionsCell.appendChild(completeBtn);

      row.appendChild(titleCell);
      row.appendChild(descCell);
      row.appendChild(createdAtCell);
      row.appendChild(actionsCell);

      pendingTasks.appendChild(row);
    } else {
      const completedAtCell = document.createElement('td');
      completedAtCell.textContent = task.completedAt;

      row.appendChild(titleCell);
      row.appendChild(descCell);
      row.appendChild(createdAtCell);
      row.appendChild(completedAtCell);
      row.appendChild(actionsCell);

      completedTasks.appendChild(row);
    }
  });
}

function markComplete(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, status: 'Completed', completedAt: new Date().toLocaleString() }
      : task
  );
  saveTasks();
  renderTasks();
}

function startEditTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    taskTitle.value = task.title;
    taskDesc.value = task.desc;
    editTaskId = id;
    saveBtn.textContent = 'Update';
  }
}

function updateTask() {
  const title = taskTitle.value.trim();
  const desc = taskDesc.value.trim();

  if (title === '' || desc === '') return;

  tasks = tasks.map(task =>
    task.id === editTaskId
      ? { ...task, title, desc, updatedAt: new Date().toLocaleString() }
      : task
  );

  editTaskId = null;
  saveBtn.textContent = 'Save';
  taskForm.reset();
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderTasks();
