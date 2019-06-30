const tasks = document.querySelectorAll('li');
console.log(tasks);
tasks.forEach(task => {
    task.addEventListener('click', event => {
        task.remove();
    });
})

const ul = document.querySelector('ul');

const toDo = document.querySelector('button');

toDo.addEventListener('click', () => {
    const li = document.createElement('li');
    li.textContent = 'New to do';
    ul.prepend(li);

})