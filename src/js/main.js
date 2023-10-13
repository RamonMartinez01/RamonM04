

async function getApi () {
    const URL = 'https://ecommercebackend.fundamentos-29.repl.co';
    try {
        const data = await fetch(URL);
        const res = await data.json();
        localStorage.setItem('products', JSON.stringify(res));
        return res;
    } catch (error) {

    }
}
async function database () {
    const db = {
        products: JSON.parse(localStorage.getItem('products')) || await getApi(),
        cart: JSON.parse(localStorage.getItem('cart')) || {},
    }
    return db;
}
function handels() {
    const btn = document.querySelector('.header__btn');
    const list = document.querySelector('.header__list');
    const cart = document.querySelector('.cart__btn');
    const modal = document.querySelector('.cart__modal');

    btn.addEventListener('click', function () { 
        list.classList.toggle('active');
    });
    cart.addEventListener('click', () =>{
        modal.classList.toggle('active')
    });
    list.addEventListener('click', function () { 
        list.classList.remove('active');
    });
};
function printProducts (products) {
    const print = document.querySelector('.products');
    let html = '';
    for (const item of products) {
        const { category, id, image, price, quantity } = item;
        html += `
        <div id="${id}" class="product">
          <figure class="product__img if${quantity}">
            <img src="${image}" alt="image product">
          </figure>  
          <div class="product__description__container"> 
            <p class="product__description">
                <span>Category:</span> ${category}<br>
                <span>Price:</span> $${price} USD<br>
                <span>Quantity</span> ${quantity}<br>
            </p>
            <div class="product__buttons">
                <button class="btn__view">Ver detalle</button> 
                <button class="btn__add">Agregar</button>
            </div>
          </div>      
        </div>
        ` 
    }
    print.innerHTML = html;
};
function addToCart (db) {
    const add = document.querySelector('.products');
    add.addEventListener('click', (event)=>{
        if (event.target.classList.contains('btn__add')) {
            const id = +event.target.closest('.product').id;
            const article = db.products.find(element => element.id===id);
            if (article.quantity===0) {
                return alert ('Este producto se encuentra agotado')
            }
            if (article.id in db.cart) {
                if (db.cart[id].amount===db.cart[id].quantity){
                    return alert ('No tenemos mas en bodega');
                }
                db.cart[article.id].amount++;
            } else {
                article.amount = 1;
                db.cart[article.id] = article;
            };
            localStorage.setItem('cart', JSON.stringify(db.cart));
            printCart (db.cart);
            printTotals (db);
        };
    });
};
function printCart (products) {
    const print = document.querySelector('.cart__products');
    let html = '';
    for (const key in products) {
         const { amount, category, id, image, price, quantity } = products[key];
       html += `
        <div id="${id}" class="cart__product">
          <figure class="cart__product__img">
            <img src="${image}" alt="image product">
          </figure>
          <div class="cart__product__container">
            <p class="cart__product__description">
               <span>Categoria:</span> ${category}<br>
               <span>precio</span> $${price} USD<br>
               <span>Cantidad</span> ${quantity} Units<br>
            </p>
            <div class="cart__product__buttons">
               <ion-icon class="less" name="remove-circle-outline"></ion-icon>
               <span>${amount}</span>
               <ion-icon class="plus" name="add-circle-outline"></ion-icon>
               <ion-icon class="trash" name="trash-outline"></ion-icon>
            </div>
          </div>
        </div>     
       `
    }
    print.innerHTML =html
};
function handleCart (db) {
    const cart = document.querySelector('.cart__products');
    cart.addEventListener('click', (event) => {
       if  (event.target.classList.contains('less')) {
            const id = event.target.closest('.cart__product').id;
            if (db.cart[id].amount===1){
                return alert ('uno es la cantidad m[inima que puedes comprar')
            }
            db.cart[id].amount--;
       }
       if  (event.target.classList.contains('plus')) {
            const id = event.target.closest('.cart__product').id;
            if (db.cart[id].amount===db.cart[id].quantity){
                return alert ('no tenemos mas en bodega');
            }
            db.cart[id].amount++;
       }
       if  (event.target.classList.contains('trash')) {
            const id = event.target.closest('.cart__product').id;
            const response = confirm('seguro que quieres borrar este producto?');
            if (!response) {
                return
            }
            delete db.cart[id];
       };
       printCart (db.cart);
       printTotals (db);
    });
};
function printTotals (db) {
    let cartTotal = document.querySelector('.cart__totals div');
    const cartIcon =document.querySelector('.cart__btn span'); 
    let cantidad = 0;
    let totales = 0;
    for (const key in db.cart) {
       const { amount, price } = db.cart[key];
       cantidad += amount;
       totales += amount * price; 
    }
    let html = `
        <p><span>Cantidad:</span> ${cantidad}</p>
        <p><span>Total:</span> ${totales} USD</p>
    `;
    cartTotal.innerHTML = html;
    cartIcon.innerHTML = cantidad;
};
function handleTotals (db) {
   const btnBuy = document.querySelector('.btn__buy'); 
   btnBuy.addEventListener('click', () =>{
      if (!Object.values(db.cart).length){
        return alert('Debes agregar productos a tu carrito antes de hacer tu compra')
      }
      const response = confirm('Estas seguro de realizar la compra?');
      if (!response) {
        return;
      }
      for (const key in db.cart) {
          if (db.cart[key].id===db.products[key-1].id){
              db.products[key-1].quantity-= db.cart[key].amount;
          }
      };
      db.cart = {};
      localStorage.setItem('products', JSON.stringify(db.products));
      localStorage.setItem('cart', JSON.stringify(db.cart));
      printProducts(db.products);
      printCart(db.cart);
      printTotals(db);
      alert('gracias por su compra!');
   });
};  
function filterProducts (products) {
    const list = document.querySelectorAll('.header__list li');
    list[0].addEventListener('click', ()=>{
        printProducts(products);
    });
    list[1].addEventListener('click', ()=>{
        const shirts = products.filter(element=>element.category==='shirt')
        printProducts(shirts);
    });
    list[2].addEventListener('click', ()=>{
        const hoddies = products.filter(element=>element.category==='hoddie')
        printProducts(hoddies);
    });
    list[3].addEventListener('click', ()=>{
        const sweaters = products.filter(element=>element.category==='sweater')
        printProducts(sweaters);
    });
};
function showDetails (products) {
    const readBtn = document.querySelector('.products');
    const showModal = document.querySelector('.view__modal');
    const closeModal = document.querySelector('.close__modal');
    const contentModal = document.querySelector('.content__modal')
    readBtn.addEventListener('click', (event)=>{
       if (event.target.classList.contains('btn__view')){
           const id = +event.target.closest('.product').id;
           const article = products.find(element=>element.id===id);
           const { category, description, image, name, price, quantity } = article;
           let html = `
               <div class="modal__product">
                 <figure class="modal__product__img">
                   <img src="${image}" alt="image product">
                 </figure>
                 <p class="modal__product__short">
                    <span>Categoria:</span> ${category}<br>    
                    <span>Precio:</span> $${price}<br>
                    <span>Cantidad:</span> ${quantity}<br>
                 </p>
               </div>
               <p class="modal__product__long">
                    <span>Nombre:</span> ${name}<br>     
                    <span>Description:</span> ${description}<br>
               <p/>`;    
           contentModal.innerHTML = html;
           showModal.classList.add('active');
       };
    });
    closeModal.addEventListener('click', ()=> {
        showModal.classList.remove('active');
    });
};
async function main (){
    const db = await database();
    handels();
    printProducts(db.products);
    addToCart (db);
    printCart (db.cart);
    handleCart (db);
    printTotals (db);
    handleTotals (db);
    filterProducts (db.products);
    showDetails (db.products);
};
main();
