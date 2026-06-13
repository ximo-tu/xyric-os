// Global Layer System Management Parameters
var biggestIndex = 10;
var selectedIcon = undefined;
const topBar = document.querySelector("#top");

// --- DATA TRACKING STORAGE ARRAYS ---
var todoItems = [
  { text: "Make the clock for xyricOS live", completed: true },
  { text: "Solve world hunger", completed: false }
];

// --- THE CORE INITIALIZATION ENGINE UTILITY ---
function initializeWindow(windowId) {
  const targetWindow = document.querySelector("#" + windowId);
  if (!targetWindow) return;

  dragElement(targetWindow);

  targetWindow.addEventListener("mousedown", function() {
    focusWindow(targetWindow);
  });

  const closeBtn = targetWindow.querySelector(".btn-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      targetWindow.style.display = "none";
    });
  }
}

function focusWindow(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (topBar) {
    topBar.style.zIndex = biggestIndex + 1;
  }
}

function openWindow(element) {
  element.style.display = "block";
  focusWindow(element);
}

// --- DRAG DRIVER REGISTRATION LOGIC ---
function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;

  const header = document.getElementById(element.id + "header");
  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    if (e.target.classList.contains('window-btn') || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = moveWindow;
  }

  function moveWindow(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// --- APPLICATION SHORTCUT MOUSE EVENTS MANAGER ---
const todoIcon = document.querySelector("#todoIcon");
const todoApp = document.querySelector("#todoApp");

if (todoIcon && todoApp) {
  todoIcon.addEventListener("click", function(e) {
    e.stopPropagation();
    
    if (todoIcon.classList.contains("selected")) {
      todoIcon.classList.remove("selected");
      selectedIcon = undefined;
      openWindow(todoApp);
    } else {
      if (selectedIcon) selectedIcon.classList.remove("selected");
      todoIcon.classList.add("selected");
      selectedIcon = todoIcon;
    }
  });
}

document.addEventListener("click", function() {
  if (selectedIcon) {
    selectedIcon.classList.remove("selected");
    selectedIcon = undefined;
  }
});

const welcomeScreen = document.querySelector("#welcome");
const openWelcomeBtn = document.querySelector("#welcomeopen");
if (openWelcomeBtn && welcomeScreen) {
  openWelcomeBtn.addEventListener("click", function() {
    openWindow(welcomeScreen);
  });
}

// --- PROGRAMMATIC TODO APP FEED LOGIC PIPELINES ---
const todoInput = document.querySelector("#todoInput");
const todoAddBtn = document.querySelector("#todoAddBtn");
const todoListContainer = document.querySelector("#todoListContainer");

function renderTodoList() {
  if (!todoListContainer) return;
  todoListContainer.innerHTML = ""; // Wipe previous visual memory elements

  todoItems.forEach(function(item, index) {
    const itemRow = document.createElement("div");
    itemRow.className = "todo-item";
    
    // Checkbox mapping
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", function() {
      item.completed = checkbox.checked;
      renderTodoList(); // Force update view state tree styles
    });

    // Content label mapping
    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = item.text;
    if (item.completed) {
      textSpan.style.textDecoration = "line-through";
      textSpan.style.opacity = "0.5";
    }

    // Delete tool button mapping
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "todo-delete";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.addEventListener("click", function() {
      todoItems.splice(index, 1);
      renderTodoList();
    });

    itemRow.appendChild(checkbox);
    itemRow.appendChild(textSpan);
    itemRow.appendChild(deleteBtn);
    todoListContainer.appendChild(itemRow);
  });
}

function handleAddTask() {
  const textInput = todoInput.value.trim();
  if (textInput !== "") {
    todoItems.push({ text: textInput, completed: false });
    todoInput.value = ""; // Clear active interface terminal buffer
    renderTodoList();
  }
}

if (todoAddBtn && todoInput) {
  todoAddBtn.addEventListener("click", handleAddTask);
  todoInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") handleAddTask();
  });
}

// --- RUNTIME BOOTSTRAPPING CORES REBOOT ---
initializeWindow("welcome");
initializeWindow("todoApp");
renderTodoList();