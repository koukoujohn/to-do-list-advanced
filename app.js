//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filter = document.querySelector('.filter-wrapper');


//Event Listeners

//when contents finish loading this listener will fetch all todo items from local storage.
document.addEventListener('DOMContentLoaded', getTodos);
//when add button is clicked it adds todo items in todo-list ul
todoButton.addEventListener('click', addTodo);
//listener for trash and check buttons
todoList.addEventListener('click', deleteEditCheck);
//listener for filter buttons
filter.addEventListener('click', filterButtons);


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
    //track completed status in localstorage
    completedAddLocal();
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

    const editedItem = item.parentElement.parentElement;
    const index = [].indexOf.call(todoList.childNodes, editedItem);


    //delete todo
    if(item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        //Adds animation/transition.
        todo.classList.add('fall');
        //Removes item from local storage.
        removeLocalTodos(todo);
        completedDeleteLocal(index);
        //After fall transition ends removes item from Dom.
        todo.addEventListener('transitionend', function(){
            todo.parentElement.remove();
        });
    }  

    //check mark adds or removes class="completed" to li
    if(item.classList[0] === 'complete-btn') {
        item.parentElement.classList.toggle('completed');
        const completedItem = item.parentElement.parentElement;
        const index = [].indexOf.call(todoList.children, completedItem);

        if(item.parentElement.classList.contains('completed')){
            completedChangeLocal(index);            
        } else if (!item.parentElement.classList.contains('completed')){
            completedChangeLocal(index);            
        }
    }
    

    if(item.classList[0] === 'edit-btn') {
        const todoEdit = todoList.querySelector('.todo-edit');
        //checks if user tried to edit to items simultaneously and throws error if so.
        if(todoEdit) alert('You can only edit one item at a time.');
        //replace it with with form that will load with text to edit. removes todo list item
        else createEditor(item);
        //
    };

    if(item.classList[0] === 'save-btn'){
        e.preventDefault();
        //target the current text.
        const newText = item.previousElementSibling.value;
        //target the wrapper div
        const editedItem = item.parentElement.parentElement;
        //target the whole todo list and make an array out of the NodeList.
        //this will return the index number of the item edited in todoList.
        const index = [].indexOf.call(todoList.children, editedItem);
        //update local storage
        updateLocalTodos(index,newText);
        //revert it back into a todo item with the updated text.
        editedItem.innerHTML = `
        <div class="todo">
            <li class="todo-item">${newText}</li>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="trash-btn"><i class="fas fa-trash"></i></button>
        </div>
        `;
        for(todo of todoList.children) todo.style.display = 'block'
    }
}

/**
 * @function filterButtons- Adds filter functionality each time a filter button is pressed.
 * @param {*} e 
 */
function filterButtons(e) {
    //get nodelist to iterate through it in each click on filter buttons
    const todos = todoList.childNodes;
    let filter = e.target.textContent;
    for(todo of todos){
        if(filter === 'All') todo.style.display = 'block';
        if(filter === 'Completed') todo.children[0].classList.contains('completed') ? todo.style.display = 'block' : todo.style.display = 'none';
        if(filter === 'Not Completed') !todo.children[0].classList.contains('completed') ? todo.style.display = 'block' : todo.style.display = 'none';
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
    const completed = JSON.parse(localStorage.getItem('completed'));

    //each existing todo item in local storage will be recreated and appended after page reloads. 
    todos.forEach(todo => createTodoElement(todo));
    
    for(let i=0; i< todos.length; i++) {
        if(completed[i] === true)
            todoList.childNodes[i].children[0].classList.add('completed');
    }

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

/**
 * @function updateLocalTodos- This function will update a todo item using the array's index number with the updated text.
 * @param {*} index The index number we want updated.
 * @param {*} newText The updated text.
 */
function updateLocalTodos(index,newText) {
    //Get current todos from local storage
    const todos = checkLocalStorage();
    //remove the specific todo item and update it with new text in local storage.
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
    if(localStorage.getItem('todos') === null) todos = [];
    else todos = JSON.parse(localStorage.getItem('todos'));
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

function completedAddLocal() {
    let completed;
    if(localStorage.getItem('completed') === null) completed = [];
    else completed = JSON.parse(localStorage.getItem('completed'));

    completed.push(false);
    localStorage.setItem('completed', JSON.stringify(completed));
}

function completedDeleteLocal(index){
    let completed;
    if(localStorage.getItem('completed') === null) completed = [];
    else completed = JSON.parse(localStorage.getItem('completed'));

    completed.splice(index,1)
    localStorage.setItem('completed', JSON.stringify(completed));
}

function completedChangeLocal(index){
    let completed;
    if(localStorage.getItem('completed') === null) completed = [];
    else completed = JSON.parse(localStorage.getItem('completed'));

    if(completed[index] === false){
        completed.splice(index,1,true)
        localStorage.setItem('completed', JSON.stringify(completed));
    } else {
        completed.splice(index,1,false)
        localStorage.setItem('completed', JSON.stringify(completed));
    }
}
