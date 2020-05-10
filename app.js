//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');

//Event Listeners
todoButton.addEventListener('click', addTodo);


//Functions

function addTodo(event) {
    event.preventDefault();
    //Make TodoDiv
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    //Create LI
    const newToDo = document.createElement('li');
    newToDo.innerText = 'hey';
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
    trashButton.classList.add('complete-btn');
    todoDiv.appendChild(trashButton);
    //append to list
    todoList.appendChild(todoDiv);
}