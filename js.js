let cards = document.querySelector('.cards');
let li = document.querySelectorAll('header li');
let boxCart = document.querySelector('.boxCart');
let btnCart = document.querySelector('.cart');
let closeCart = document.querySelector('.cart__close');
let countCart = document.querySelector('.count__cart');
let priceCart = document.querySelector('.priceCart');
let inputSearch = document.querySelector('.search')

let category = "";
let arrCart = [];

let liActive = null;

let showHtml = (data) => {
    cards.innerHTML = '';
    data.forEach((el) => {
        cards.innerHTML += `
        <div data-id="${el.id}" class="card">
            <div>
                <a href="oneProduct/oneProduct.html#${el.id}">
                    <img src="${el.image}" alt="">
                </a>
                <h4>${el.title}</h4>
                <h3>Price: ${el.price}</h3>
                <p class="description">
                    ${el.isActive ? el.description : el.description.slice(0, 30)}
                    <button data-id="${el.id}" class="btnMore">...</button>
                </p>
            </div>
            <button class="btnsCartAdd" data-id="${el.id}">В корзину</button>
            <button class="btnsCartDelete" data-id="${el.id}">Удалить</button>
        </div>
        `;
    });

    cards.querySelectorAll('.btnMore').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            let productId = event.target.dataset.id;
            let productIndex = data.findIndex((item) => item.id == productId);
            data[productIndex].isActive = !data[productIndex].isActive;
            showHtml(data);
        });
    });

    cards.querySelectorAll('.btnsCartDelete').forEach(btn => {
        btn.addEventListener('click', (event) => {
            let productId = event.target.dataset.id;
            let productIndex = arrCart.findIndex((item) => item.id == productId);
            arrCart.splice(productIndex, 1);
            showCart(); 
            saveCartToLocalStorage();
    

            if (arrCart.length === 0) {
                countCart.textContent = ''; 
            } else if (arrCart.length > 9) {
                countCart.textContent = '9+'; 
            } else {
                countCart.textContent = arrCart.length; 
            }
        });
    });

    cards.querySelectorAll('.btnsCartAdd').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            let find = data.find((item) => item.id === +btn.dataset.id);
            let sameId = arrCart.find((item) => item.id === find.id);

            if (sameId) {
                if (sameId.counter < 9) {
                    sameId.counter += 1;
                } else {
                    alert('Максимальное количество товаров в корзине достигнуто (9)');
                }
            } else {
                find.counter = 1;
                arrCart.push(find);
            }

            if (arrCart.length > 9) {
                countCart.textContent = '9+';
            } else {
                countCart.textContent = arrCart.length;
            }
            
            showCart();
            saveCartToLocalStorage();
        });
    });
};


let showCart = () => {
    boxCart.innerHTML = '';
    arrCart.forEach((el) => {
        boxCart.innerHTML += `
        <div class="oneCart" data-id="${el.id}">
            <img src="${el.image}" alt="">
            <h4>${el.title}</h4>
            <button class="btnMinus" data-id="${el.id}">-</button>
            <p>${el.counter}</p>
            <button class="btnPlus" data-id="${el.id}">+</button>
            <h2  class="priceTag">${el.price * el.counter}</h2>
        </div>
        `;
    });

    document.querySelectorAll('.btnMinus').forEach(btn => {
        btn.addEventListener('click', (event) => {
            let productId = event.target.dataset.id;
            let productIndex = arrCart.findIndex((item) => item.id == productId);
            if (arrCart[productIndex].counter > 1) {
                arrCart[productIndex].counter -= 1;
                showCart();
                saveCartToLocalStorage();
            }
        });
    });

    document.querySelectorAll('.btnPlus').forEach(btn => {
        btn.addEventListener('click', (event) => {
            let productId = event.target.dataset.id;
            let productIndex = arrCart.findIndex((item) => item.id == productId);
            if (arrCart[productIndex].counter < 9) {
                arrCart[productIndex].counter += 1;
                showCart();
                saveCartToLocalStorage();
            } else {
                alert('Максимальное количество товаров в корзине достигнуто (9)');
            }
        });
    });
};

let showProducts = () => {
    fetch(`https://fakestoreapi.com/products/${category === 'jewelery'?'category/jewelery':category === 'electronics'?'category/electronics':category === "men's clothing"?"category/men's clothing":category === "women's clothing"?"category/women's clothing":''}`)
    .then((res)=>res.json())
    .then((data)=>{
        showHtml(data);
    });
};




let searchProducts = (searchTerm) => {
    fetch(`https://fakestoreapi.com/products`)
    .then((res) => res.json())
    .then((data) => {
        let filteredData = data.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()));
        showHtml(filteredData);
    });
};


inputSearch.addEventListener('input', (event) => {
    let searchTerm = event.target.value;
    searchProducts(searchTerm);
});




li.forEach((el)=>{
    el.addEventListener('click',()=>{
        category = el.textContent;
        if (liActive) {
            liActive.style.color = 'black';
        }
        el.style.color = 'red';
        liActive = el;
        showProducts();
    });
});

btnCart.addEventListener('click',()=>{
    boxCart.classList.toggle('active');
});

closeCart.addEventListener('click',()=>{
    boxCart.classList.remove('active');
});

let saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(arrCart));
};
    

let loadCartFromLocalStorage = () => {
    let cartData = localStorage.getItem('cart');
    if (cartData) {
        arrCart = JSON.parse(cartData);
        showCart();
        
        
        updateCartCounter();
    }
};


let updateCartCounter = () => {
    if (arrCart.length === 0) {
        countCart.textContent = ''; 
    } else if (arrCart.length > 9) {
        countCart.textContent = '9+'; 
    } else {
        countCart.textContent = arrCart.length; 
    }
};

loadCartFromLocalStorage();



showProducts();