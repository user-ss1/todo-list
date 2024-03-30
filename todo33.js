let main = document.querySelector(".main");
let both = document.getElementById("both");
let search = document.getElementById("search");
let save = document.getElementById("save");
const h2 = document.querySelector('.main > h2');

const getTodoListFromLocal = () => {
    return JSON.parse(localStorage.getItem("key"));
}

const addlocal = (arr) => {
    return localStorage.setItem("key", JSON.stringify(arr));
}

let arr = getTodoListFromLocal() || [];
let messageTimeout = null;

const todoadd = (curEle) => {
    const divEle = document.createElement("div");
    divEle.classList.add("container");
    divEle.innerHTML = `<ul><li>${curEle}</li></ul><button class="deleteBtn">delete</button>`;
    const referenceElement = both.nextElementSibling;
    main.insertBefore(divEle, referenceElement);
}

const taskCountElement = document.createElement("h3");
taskCountElement.classList.add("task-count");
updateTaskCount(); // Initial update
main.insertBefore(taskCountElement, h2.nextSibling);

function updateTaskCount() {
    taskCountElement.textContent = `Total Saved Tasks: ${arr.length}`;
}

const add = (e) => {
    e.preventDefault();
    const todovalue = search.value.trim();
    search.value = "";

    if (todovalue === "") {
        displayMessage(`Please ensure you write your task before saving.<br> Empty tasks cannot be added.`);
    } else if (!/^\D/.test(todovalue)) {
        displayMessage("Please write an appropriate task before saving.<br> Tasks cannot start with digits.");
    } else if (!arr.includes(todovalue.toLowerCase())) {
        arr.push(todovalue.toLowerCase());
        arr = [...new Set(arr)];
        localStorage.setItem("key", JSON.stringify(arr));
        todoadd(todovalue);
        updateTaskCount();
    }
}

function displayMessage(message) {
    // Remove any existing message
    removeMessage();// Create new message element
    const newHeading = document.createElement("h4");
    newHeading.innerHTML = message;
    both.parentNode.insertBefore(newHeading, both.nextSibling);

    // Remove the message after 2 seconds
    messageTimeout = setTimeout(() => {
        removeMessage();
    }, 2000);
}

function removeMessage() {
    // Clear the timeout if present
    if (messageTimeout) {
        clearTimeout(messageTimeout);
        messageTimeout = null;
    }

    // Remove the message element if present
    const messageElement = document.querySelector(".main > h4");
    if (messageElement) {
        messageElement.remove();
    }
}

save.addEventListener("click", (e) => {
    add(e);
});

const show = () => {
    arr.forEach((curEle) => {
        todoadd(curEle);
    })
}
show();

const removeEle = (e) => {
    const delEle = e.target;
    let content = delEle.previousElementSibling.textContent;
    let parent = delEle.parentElement;
 
    arr = arr.filter((curr) => {
        return curr != content.toLowerCase();
    })
    addlocal(arr);
    parent.remove();
  
    updateTaskCount();
}

main.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("deleteBtn")) {
        removeEle(e);
    }
});

document.getElementById("search").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        add(event);
    }
});
