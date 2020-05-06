'use strict'
const cartButton = document.querySelector("#cart-button")
const modal = document.querySelector(".modal")
const close = document.querySelector(".close")
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
const cardsRest = document.querySelector('.cards-restaurants')
const promo = document.querySelector('.container-promo')
const rests = document.querySelector('.restaurants')
const menu = document.querySelector('.menu')
const logo = document.querySelector('.logo')
const cardsMenu = document.querySelector('.cards-menu')

let user = {
  login: localStorage.getItem('userLogin') || '',
  password: localStorage.getItem('userPassword') || '',
}

function toggleModal() {
  modal.classList.toggle("is-open")
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

function createCardsRest () {
  const card = `
      <a class="card card-restaurant">
        <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">Тануки</h3>
            <span class="card-tag tag">60 мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
              4.5
            </div>
            <div class="price">От 1 200 ₽</div>
            <div class="category">Суши, роллы</div>
          </div>
        </div>
      </a>
  `
  cardsRest.insertAdjacentHTML('beforeend', card)
}

function createCardGood () {
  const card = document.createElement('div')
  card.className = 'card'
  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
                                грибы.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div>
    </div>
  `)
  cardsMenu.insertAdjacentElement('beforeend', card)
}

function openGoods (event) {
  if (user.login && user.password) {
    const target = event.target
    const rest = target.closest('.card-restaurant')
    if (rest) {
      promo.classList.add('hide')
      rests.classList.add('hide')
      menu.classList.remove('hide')
      cardsMenu.textContent = ''
      createCardGood()
    }
  } else {
    toggleModalAuth()
  }
}

cardsRest.addEventListener('click', openGoods)

cartButton.addEventListener("click", toggleModal)

close.addEventListener("click", toggleModal)

logo.addEventListener('click', () => {
  promo.classList.remove('hide')
  rests.classList.remove('hide')
  menu.classList.add('hide')
})

checkAuth()

createCardsRest()
createCardsRest()