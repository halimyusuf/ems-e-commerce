const modal = document.querySelector('.modal');
const shoppingCart = document.querySelector('.nav-cart');
const shoppingCartCont = document.querySelector('.shopping-cart');
const itemSectionData = document.querySelector('.items-section-data');
const itemSectionDataCheckout = document.querySelector(
  '.items-section-data-checkout'
);
const successfulPay = document.querySelector('.on-successful-payment');
const totalAmt = document.querySelector('.checkout-summary h2');
const itemPurchasedUser = document.querySelector('.user-purchased');
let totalAmount = 0;
const formData = {
  name: 'James ',
  email: '',
  phone: '',
};

// initialized to false for all 3 states
const isFormValid = [false, false, false];

const inputDetails = {
  name: 'name-val',
  email: 'email-val',
  phone: 'phone-val',
};
const emailRe = /^[^\s@]+@[^\s@]+$/;
const phoneRe = /^[1-9]{1}[0-9]{3,14}$/;

const validations = {
  name: (a) => !!a || 'Name is required',
  email: (a) => emailRe.test(a) || 'Please enter a valid mail',
  phone: (a) => phoneRe.test(a) || 'Please enter a valid phone number',
};

shoppingCart.addEventListener('click', () => {
  modal.style.display = 'block';
  let count = 1;
  let total = 0;
  for (const a in cart) {
    const tr = document.createElement('tr');
    tr.setAttribute('id', `cart-item-${a}`);
    const temp = [];
    console.log(a);
    for (let i = 0; i < 5; i++) {
      const td = document.createElement('td');
      temp.push(td);
    }
    // first column
    temp[0].textContent = count;
    // second column
    temp[1].textContent = cart[a].name;
    // third column
    temp[2].textContent = `₦${cart[a].price.toLocaleString()}`;
    // update total price
    total += cart[a].price * cart[a].quantity;
    // fourth column
    const qty = document.createElement('div');
    qty.className = 'qty-cng';
    const btn1 = document.createElement('button');
    btn1.textContent = '-';
    const btn2 = document.createElement('button');
    btn2.textContent = '+';
    const qtyNo = document.createElement('div');
    qtyNo.className = 'qty-cng-txt';
    qtyNo.textContent = cart[a].quantity;
    btn1.addEventListener('click', () => {
      if (cart[a].quantity > 1) {
        cart[a].quantity -= 1;
        qtyNo.textContent = cart[a].quantity;
        // update total price
        updateTotalPrice(cart[a].price * -1);
      } else {
      }
    });
    btn2.addEventListener('click', () => {
      cart[a].quantity += 1;
      qtyNo.textContent = cart[a].quantity;
      // update total price
      updateTotalPrice(cart[a].price);
    });

    qty.appendChild(btn1);
    qty.appendChild(qtyNo);
    qty.appendChild(btn2);
    temp[3].appendChild(qty);

    const remBtn = document.createElement('button');
    remBtn.textContent = 'Remove';
    remBtn.classList = ['cart-item-rem-btn'];
    remBtn.addEventListener('click', () => {
      itemSectionData.removeChild(document.querySelector(`#cart-item-${a}`));
      updateTotalPrice(cart[a].price * cart[a].quantity * -1);
      delete cart[a];
      navCartNo.textContent = Object.values(cart).length;
      // update total amount
    });

    // remove button
    temp[4].appendChild(remBtn);

    for (let children of temp) {
      tr.appendChild(children);
    }
    itemSectionData.appendChild(tr);
    count = count + 1;
  }
  updateTotalPrice(total);
});

window.addEventListener('click', (event) => {
  if (event.target == modal) {
    closeModal();
  }
});

document
  .querySelector('.checkout-action button')
  .addEventListener('click', () => {
    closeModal();
  });

function parseAmount(price) {
  price = price.replaceAll('₦', '');
  price = price.replaceAll(',', '');
  price = parseFloat(price);
  return price;
}

function updateTotalPrice(amount) {
  let price = totalAmt.textContent;
  price = parseAmount(price);
  price += amount;
  totalAmt.textContent = `₦${price.toLocaleString()}`;
}

function closeModal() {
  modal.style.display = 'none';
  while (itemSectionData.firstChild)
    itemSectionData.removeChild(itemSectionData.firstChild);
  totalAmount = parseAmount(totalAmt.textContent);
  totalAmt.textContent = 0;
}

// input events
for (let i = 0; i < 3; i++) {
  const a = Object.keys(formData)[i];
  document
    .querySelector(`input[name=${a}]`)
    .addEventListener('change', (event) => {
      formData[a] = event.target.value;
      const vd = validations[a](event.target.value);
      const currInp = document.querySelector('#' + inputDetails[a]);
      if (!(vd === true)) {
        currInp.textContent = vd;
        isFormValid[i] = false;
      } else {
        currInp.textContent = '';
        isFormValid[i] = true;
      }
    });
}

document.querySelector('.checkout-btn').addEventListener('click', () => {
  const formValid = isFormValid.reduce((a, b) => a && b, true);
  if (formValid) {
    closeModal();
    payWithPaystack();
  } else {
    alert('Please fill the checkout form.');
  }
});

document.querySelector('.item-purchased-ok').addEventListener('click', () => {
  closeModal();
  window.location.reload();
});

function onCheckoutTable() {
  modal.style.display = 'block';
  successfulPay.style.display = 'flex';
  shoppingCartCont.style.display = 'none';
  count = 1;
  for (const a in cart) {
    const tr = document.createElement('tr');
    tr.setAttribute('id', `cart-item-${a}-1`);
    const temp = [];
    for (let i = 0; i < 3; i++) {
      const td = document.createElement('td');
      temp.push(td);
    }
    // first column
    temp[0].textContent = count;
    // second column
    temp[1].textContent = cart[a].name;
    // third column
    temp[2].textContent = cart[a].quantity;
    for (let children of temp) {
      tr.appendChild(children);
    }
    itemSectionDataCheckout.appendChild(tr);
    count++;
  }
}

function payWithPaystack() {
  console.log(totalAmount);
  var handler = PaystackPop.setup({
    key: 'pk_test_3bdb6f21126495dd4a554561943b4ba145859586', // Replace with your public key
    email: formData.email,
    amount: totalAmount * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
    currency: 'NGN', // Use GHS for Ghana Cedis or USD for US Dollars
    ref: String(Date.now()), // Replace with a reference you generated
    callback: function (response) {
      //this happens after the payment is completed successfully
      var reference = response.reference;
      itemPurchasedUser.textContent = formData.name;
      onCheckoutTable();
    },
    onClose: function () {
      alert('Transaction was not completed, window closed.');
    },
  });
  handler.openIframe();
}
