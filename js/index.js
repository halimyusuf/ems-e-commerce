const cart = {};

const productsEle = document.querySelector('.store-items');
const productEle = document.querySelector('.product');
const navCartNo = document.querySelector('.nav-cart-no');
const navBtns = document.querySelectorAll('.nav-btn');
let currentNavTab = null;

// remove template
productsEle.removeChild(productEle);

// initialize nav-cart
navCartNo.textContent = Object.values(cart).length;

navBtns.forEach((navBtn) => {
  navBtn.addEventListener('click', (element) => {
    element = element.target;
    console.log(element.className);
    if (currentNavTab !== null) {
      currentNavTab.classList.remove('nav-btn-active');
    }
    // element.className += 'nav-btn-active';
    element.classList.add('nav-btn-active');
    console.log(element.className);
    currentNavTab = element;
  });
});

// create project elements
for (let p of products) {
  let cl = productEle.cloneNode(true);
  const img = cl.querySelector('div img');
  const itemPrice = cl.querySelector('.item-price');
  img.setAttribute('src', `assets/images/${p.img}`);
  itemPrice.textContent = '₦' + p.price.toLocaleString();
  const productName = cl.querySelector('.product-label');
  productName.textContent = p.name;
  const btn = cl.querySelector('button');
  btn.setAttribute('id', p.id);
  if (cart[p.id]) {
    btn.setAttribute('class', 'product-in-cart');
    btn.textContent = 'REMOVE FROM CART';
  } else {
    btn.setAttribute('class', '');
    btn.textContent = 'ADD TO CART';
  }
  btn.addEventListener('click', toggleCart);
  productsEle.appendChild(cl);
}

function toggleCart(ele) {
  const element = ele.target;
  const id = element.id;
  if (!cart[id]) {
    product = products.find((a) => a.id == id);
    product.quantity = 1;
    cart[id] = product;
    element.setAttribute('class', 'product-in-cart');
    element.parentElement.parentElement.querySelector(
      '.item-price-cont'
    ).style.display = 'block';
    element.textContent = 'REMOVE FROM CART';
  } else {
    delete cart[id];
    element.setAttribute('class', '');
    element.textContent = 'ADD TO CART';
    element.parentElement.parentElement.querySelector(
      '.item-price-cont'
    ).style.display = 'none';
  }
  navCartNo.textContent = Object.values(cart).length;
}
