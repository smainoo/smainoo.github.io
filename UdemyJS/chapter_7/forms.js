const form = document.querySelector('.signup-form');

const feedback = document.querySelector('.feedback');
const usernamePattern = /^[a-zA-Z]{6,12}$/

form.addEventListener('submit', e =>{
    e.preventDefault();

    //validation
const username = form.username.value;
const usernamePattern = /^[a-zA-Z]{6,12}$/

if(usernamePattern.test(username)){
    //good feedback
    feedback.textContent = 'Username is correct!'
}else{
    //bad feedback
    feedback.textContent = 'Username must be only letters & must be between 6 to 12 characters long'
}

});

//live feedback
form.username.addEventListener('keyup', e => {
    // console.log(e.target.value, form.username.value);
    if(usernamePattern.test(e.target.value)){
        form.username.setAttribute('class', 'success');
    }else{
        form.username.setAttribute('class', 'error');
    }
})