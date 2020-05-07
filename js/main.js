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
const restInfo = document.querySelector('.wrap-rest-info')
const logo = document.querySelector('.logo')
const cardsMenu = document.querySelector('.cards-menu')

let user = {
  login: localStorage.getItem('userLogin') || '',
  password: localStorage.getItem('userPassword') || '',
}

const getData = async function (url) {
  const data = await fetch(url).then(r => r.json()).catch(e => {throw new Error(`error on ${url}`)})
  // console.log(data)
  return data
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

function createCardsRest (rest) {
  const card = `
      <a class="card card-restaurant" data-products="${rest.products}" data-restaurant="${rest.name}">
        <img src="${rest.image}" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${rest.name}</h3>
            <span class="card-tag tag">${rest.time_of_delivery}</span>
          </div>
          <div class="card-info">
            <div class="rating">
              ${rest.stars}
            </div>
            <div class="price">От ${rest.price} ₽</div>
            <div class="category">${rest.kitchen}</div>
          </div>
        </div>
      </a>
  `
  cardsRest.insertAdjacentHTML('beforeend', card)
}

function createCardGood (good) {
  const card = document.createElement('div')
  card.className = 'card'
  card.insertAdjacentHTML('beforeend', `
    <img src="${good.image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${good.name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${good.description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${good.price}</strong>
      </div>
    </div>
  `)

  cardsMenu.insertAdjacentElement('beforeend', card)
}
function createHeaderRestaurant (nameRestaurant) {
  let restaurant
  getData('./db/partners.json').then(data => {
    restaurant = data.find(rest => rest.name === nameRestaurant)

    restInfo.innerHTML = null
    const headerRest = `
      <h2 class="section-title restaurant-title">${restaurant.name}</h2>
      <div class="card-info">
        <div class="rating">
          ${restaurant.stars}
        </div>
        <div class="price">От ${restaurant.price} ₽</div>
        <div class="category">${restaurant.kitchen}</div>
      </div>
    `
    restInfo.insertAdjacentHTML('beforeend', headerRest)
  })
  
}
function openGoods (event) {
  if (user.login && user.password) {
    const target = event.target
    const rest = target.closest('.card-restaurant')
    if (rest) {
      cardsMenu.textContent = ''
      promo.classList.add('hide')
      rests.classList.add('hide')
      menu.classList.remove('hide')
      const nameRest = rest.dataset.restaurant
      createHeaderRestaurant(nameRest)
      getData(`./db/${rest.dataset.products}`).then(data => {
        data.forEach(createCardGood)
      })
    }
  } else {
    toggleModalAuth()
  }
}
function init () {
  getData('./db/partners.json').then(data => {
    data.forEach(createCardsRest)
  })

  cartButton.addEventListener("click", toggleModal)

  close.addEventListener("click", toggleModal)

  cardsRest.addEventListener('click', openGoods)

  logo.addEventListener('click', () => {
    promo.classList.remove('hide')
    rests.classList.remove('hide')
    menu.classList.add('hide')
  })

  checkAuth()
}

init()
