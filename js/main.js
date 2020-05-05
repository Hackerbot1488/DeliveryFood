const cartButton = document.querySelector("#cart-button")
const modal = document.querySelector(".modal")
const close = document.querySelector(".close")

cartButton.addEventListener("click", toggleModal)
close.addEventListener("click", toggleModal)

function toggleModal() {
  modal.classList.toggle("is-open")
}

// day 1

const authButton = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeAuth = document.querySelector('.close-auth')
const logInForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login')
const passwordInput = document.querySelector('#password')
const userName = document.querySelector('.user-name')
const buttonOut = document.querySelector('.button-out')
const errorPassword = document.querySelector('#error-password')
const errorLogin = document.querySelector('#error-login')

let user = {
  login: localStorage.getItem('userLogin') || '',
  password: localStorage.getItem('userPassword') || '',
}
function toggleModalAuth () {
  if (modalAuth.classList.contains("is-open")) {
    modalAuth.classList.remove("is-open")
  } else {
    modalAuth.classList.toggle("is-open")
  }
}
function authorized () {
  console.log('Auth')
  authButton.style.display = 'none'
  buttonOut.style.display = 'block'
  userName.textContent = user.login
  userName.style.display = 'inline'

  function logOut () {
    buttonOut.style.display = 'none'
    authButton.style.display = 'block'
    userName.textContent = ''
    userName.style.display = 'none'
    user.password = ''
    user.login = ''
    localStorage.setItem('userPassword', '')
    localStorage.setItem('userLogin', '')
    buttonOut.removeEventListener('click', logOut)
    checkAuth()
  }
  buttonOut.addEventListener('click', logOut)
}

function notAuthorized () {
  console.log('not auth')

  function logIn (event) {
    event.preventDefault()
    if ((loginInput.value && loginInput.value.trim()) && (passwordInput.value && passwordInput.value.trim())) {
      user.login = loginInput.value.trim()
      user.password = passwordInput.value.trim()
      localStorage.setItem('userLogin', user.login)
      localStorage.setItem('userPassword', user.password)
      errorLogin.style.display = 'none'
      errorPassword.style.display = 'none'
      logInForm.reset()
      toggleModalAuth()
      authButton.removeEventListener('click', toggleModalAuth)
      closeAuth.removeEventListener('click', toggleModalAuth)
      logInForm.removeEventListener('submit', logIn)
      checkAuth()
    } else {
      if ((!loginInput.value || !loginInput.value.trim())) {
        errorLogin.style.display = 'inline'
      } else {
        errorLogin.style.display = 'none'
      }
      if (!passwordInput.value || !passwordInput.value.trim()) {
        errorPassword.style.display = 'inline'
      } else {
        errorPassword.style.display = 'none'
      }
    }
  }

  authButton.addEventListener('click', toggleModalAuth)
  closeAuth.addEventListener('click', toggleModalAuth)
  logInForm.addEventListener('submit', logIn)
}
function checkAuth () {
  if (user.login.trim()) {
    authorized()
  } else {
    notAuthorized()
  }
}

checkAuth()