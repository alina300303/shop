let box = document.querySelector('.box')

fetch(`https://fakestoreapi.com/products/${location.hash.slice(1)}`)
.then((res)=>res.json())
.then((one)=>{
    box.innerHTML +=`
    <img class="img__one" src="${one.image}" alt="">
    <h2>${one.title}</h2>
    `
})
