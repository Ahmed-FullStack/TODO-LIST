const btn = document.querySelector('button')
const cheese = document.querySelector('.cheese')

btn.addEventListener('click', () => {
    cheese.classList.toggle('remove')
})