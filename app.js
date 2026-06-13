// Drag
dragElement(document.getElementById("welcome"));

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
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    
    document.onmouseup = stopDragging;
    document.onmousemove = moveWindow; // Named uniquely to prevent call-stack crash
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

// Buttons
const welcomeScreen = document.querySelector("#welcome");
const closeBtn = document.querySelector(".btn-close");
const openBtn = document.querySelector("#welcomeopen");

function closeWindow(element) {
  element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "block";
}

// Stop propagation so clicking buttons doesn't drag the window panel
closeBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  closeWindow(welcomeScreen);
});

openBtn.addEventListener("click", function(e) {
  openWindow(welcomeScreen);
});