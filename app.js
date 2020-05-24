//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');





//Event Listeners

//when contents finish loading this listener will fetch all todo items from local storage.
document.addEventListener('DOMContentLoaded', getTodos);
//when add button is clicked it adds todo items in todo-list ul
todoButton.addEventListener('click', addTodo);
//listener for trash and check buttons
todoList.addEventListener('click',deleteEditCheck);

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
    createTodoElement(todoInput.value);
    //Add created todo into local storage
    saveLocalTodos(todoInput.value);
    //clear todo input value
    todoInput.value = '';
}

/**
 * @function deleteEditCheck
 * @description This function will delete a list item if trash button is clicked and mark it as completed if
 * check icon is clicked.
 * @param {*} e - An event parameter passed by the addEventListener.
 */
function deleteEditCheck(e) {
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
            todo.parentElement.remove();
        });
    }  

    //check mark adds or removes class="completed" to li
    if(item.classList[0] === 'complete-btn') item.parentElement.classList.toggle('completed');
    

    if(item.classList[0] === 'edit-btn') {
        const todoEdit = todoList.querySelector('.todo-edit');
        //checks if user tried to edit to items simultaneously and throws error if so.
        console.log(todoEdit);
        if(todoEdit) alert('You can only edit one item at a time.');
        //replace it with with form that will load with text to edit. removes todo list item
        else createEditor(item);
        //after enter or + is pressed replace form with a div containing the new text and all the buttons

    };

    if(item.classList[0] === 'save-btn'){
        e.preventDefault();

        const newText = item.previousElementSibling.value;
        const editedItem = item.parentElement.parentElement;
        //this will return the index number of the item edited in todoList.
        const index = [].indexOf.call(todoList.children, editedItem);
        updateLocalTodos(index,newText);
        const editedTodo = item.parentElement.parentElement;
        editedTodo.innerHTML = `
        <div class="todo">
            <li class="todo-item">${newText}</li>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="trash-btn"><i class="fas fa-trash"></i></button>
        </div>
        `;
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
    todos.forEach(todo => createTodoElement(todo));
}

/**
 * @function removeLocalTodos
 * @description This function will delete a todo item when the trash button is clicked.
 * @param {string} todo - A value passed by the deleteEditCheck() function.
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

function updateLocalTodos(index,newText) {
    const todos = checkLocalStorage();
    console.log(index);
    todos.splice(index, 1, newText);
    localStorage.setItem('todos', JSON.stringify(todos))
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

/**
 * @function createEditor It will create an editor that will replace the todo div.
 * @param {*} item event target that was clicked.
 */
function createEditor(item){
    const textToEdit = item.previousElementSibling.previousElementSibling.textContent;
    const todoElement = item.parentElement.parentElement;
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.setAttribute('type','text');
    input.classList.add('todo-edit');
    input.setAttribute('value', textToEdit);
    form.appendChild(input);
    const button = document.createElement('button');
    button.setAttribute('type','submit');
    button.classList.add('save-btn');
    button.innerHTML = '<i class="fas fa-save"></i>';
    form.appendChild(button);
    todoElement.appendChild(form);
    todoElement.children[0].remove();
}

/**
 * @function createTodoElement Will create a new todo element or load it from local storage at DOMContentLoad
 * @param {*} item text to be added on the todo item 
 */
function createTodoElement(item){
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('todo-wrapper');
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    wrapperDiv.appendChild(todoDiv);
    //Create LI, get entered value from .todoInput and store it in li elements innerText.Add class="todo-item"
    const newToDo = document.createElement('li');
    newToDo.innerText = item;
    newToDo.classList.add('todo-item');
    todoDiv.appendChild(newToDo);
    //Create check mark button including the icon and add class="complete-btn"
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);
    //Create edit Button with icon and class="edit-btn"
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add('edit-btn');
    todoDiv.appendChild(editButton);
    //Create trash Button with icon and class="trash-btn"
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);
    //After everything is created and appended, append all into todoList wrapper.
    todoList.appendChild(wrapperDiv);
}