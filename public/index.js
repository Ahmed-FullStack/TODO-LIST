const navList = document.querySelector('.nav__list')
const hame = document.querySelector('.ham')

hame.addEventListener('click', () => {
    navList.classList.toggle('visibility')
    hame.classList.toggle('x')
})

