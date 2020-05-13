//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');


//Event Listeners

//when contents finish loading this listener will fetch all todo items from local storage.
document.addEventListener('DOMContentLoaded', getTodos);
//when add button is clicked it adds todo items in todo-list ul
todoButton.addEventListener('click', addTodo);
//listener for trash and check buttons
todoList.addEventListener('click',deleteCheck);
//listener for select element
filterOption.addEventListener('click', filterTodo);

//Functions

/**
 * @function addTodo
 * @description This function will create a new Todo List Item and append it.
 * @param {*} e - An event parameter passed by the addEventListener.
 */
function addTodo(e) {
    //prevent form submission and reloading
    e.preventDefault();
    //Make the external TodoDiv with class="todo"
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    //Create LI, get entered value from .todoInput and store it in li elements innerText.Add class="todo-item"
    const newToDo = document.createElement('li');
    newToDo.innerText = todoInput.value;
    newToDo.classList.add('todo-item');
    todoDiv.appendChild(newToDo);
    //Create check mark button including the icon and add class="complete-btn"
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    //Create trash Button with icon and class="trash-btn"
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);
    //After everything is created and appended, append al into todoList wrapper.
    todoList.appendChild(todoDiv);
    //Add created todo into local storage
    saveLocalTodos(todoInput.value);
    //clear todo input value
    todoInput.value = '';
}

/**
 * @function deleteCheck
 * @description This function will delete a list item if trash button is clicked and mark it as completed if
 * check icon is clicked.
 * @param {*} e - An event parameter passed by the addEventListener.
 */
function deleteCheck(e) {
    const item = e.target;
    //delete todo
    if(item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        //Adds animation/transition.
        todo.classList.add('fall');
        //Removes item from local storage.
        removeLocalTodos(todo);
        //After fall transition ends removes item from Dom.
        todo.addEventListener('transitionend', function(){
            todo.remove();
        });
    }
    //check mark adds class="completed" to li
    if(item.classList[0] === 'complete-btn') item.parentElement.classList.toggle('completed');
}

/**
 * @deprecated Filtering will be changed from select element into buttons.
 */
function filterTodo(e)   {
    const todos = todoList.childNodes;
    let filter = e.target.value;
    console.log(filter);
    for(todo of todos){
        // console.log(todo);
        if(filter === 'all') todo.style.display = 'flex';
        else if(filter === 'completed') todo.classList.contains('completed') ? todo.style.display = 'flex' : todo.style.display = 'none';
        else !todo.classList.contains('completed') ? todo.style.display = 'flex' : todo.style.display = 'none';
    }
}

/**
 * @function saveLocalTodos
 * @description This function will save a new item in local storage.It will create a new array "database" if it doesn't exist.
 * @param {string} todo - A value passed by the addTodo() function.
 */
function saveLocalTodos(todo)   {
    //before saving check if i already have things in the list in local storage
    const todos = checkLocalStorage();
    //get todo value that is passed from addTodo() pushed into todos array and store it.
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * @function getTodos
 * @description After DOM finishes loading,this function will get and create all existing todos from local storage if they exist.
 */
function getTodos() {
    const todos = checkLocalStorage();

    //each existing todo item in local storage will be recreated and appended after page reloads. 
    todos.forEach(todo => {
        //Make TodoDiv
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        //Create LI
        const newToDo = document.createElement('li');
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        todoDiv.appendChild(newToDo);
        //Check mark button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add('complete-btn');
        todoDiv.appendChild(completedButton);
        //Check trash Button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);
        //append to list
        todoList.appendChild(todoDiv);
    });
}

/**
 * @function removeLocalTodos
 * @description This function will delete a todo item when the trash button is clicked.
 * @param {string} todo - A value passed by the deleteCheck() function.
 */
function removeLocalTodos(todo) {
    /*This function doesn't check if an array exist in localstorage,because in order to be able to click
    trash icon an item has to exist in local storage. Thus directly fetches todos list.
    */
    let todos = JSON.parse(localStorage.getItem('todos'));
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * @function checkLocalStorage
 * @description Checks if local storage is empty or not. If empty, creates an empty array Object else fetches array from local storage.
 * @returns todos array. Either empty or parsed from local storage.
 */
function checkLocalStorage() {
    let todos;
    //if local storage is empty create an empty array. Else parse it and store it in todos.
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}