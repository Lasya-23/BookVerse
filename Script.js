// @ts-nocheck // script.js - corrected

// ----- GLOBALS -----
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// ----- ADD TO CART -----
function addToCart(id){
    var book = booksData.find(function(b){ return b.id === id; });
    if(!book) return;
    cart.push(book);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(book.name + ' added to cart!');
}

function updateCartCount(){
    var cartCountEl = document.getElementById('cart-count');
    if(cartCountEl) cartCountEl.textContent = cart.length;
}

// ----- LOGIN FUNCTIONS -----
var generatedOTP;
function sendOTP(){
    var mobile = document.getElementById('mobile').value;
    if(!mobile || mobile.length !== 10){
        alert('Enter valid 10-digit mobile number');
        return;
    }
    generatedOTP = Math.floor(1000 + Math.random() * 9000);
    alert('Your OTP is: ' + generatedOTP); // Simulated OTP
    var otpSection = document.getElementById('otp-section');
    if(otpSection) otpSection.style.display = 'block';
}

function verifyOTP(){
    const entered = document.getElementById('otp').value;
    const mobile = document.getElementById('mobile').value;

    if(entered == generatedOTP){
        localStorage.setItem('mobile', mobile); // ✅ SAVE MOBILE
        alert("Login Successful");
        window.location.href = "home.html";
    } else {
        alert("Invalid OTP");
    }
}

// ----- BOOK DATA -----
var booksData = [
    {id:1, name:'Clean Code', price:499, image:'https://covers.openlibrary.org/b/id/9641651-L.jpg', category:'Programming'},
    {id:2, name:'JavaScript Basics', price:299, image:'https://covers.openlibrary.org/b/id/10256389-L.jpg', category:'Programming'},
    {id:3, name:'Python for Beginners', price:399, image:'https://covers.openlibrary.org/b/id/10523361-L.jpg', category:'Programming'},
    {id:4, name:'Fictional Story', price:199, image:'https://covers.openlibrary.org/b/id/10612345-L.jpg', category:'Fiction'},
    {id:5, name:'Science Wonders', price:349, image:'https://covers.openlibrary.org/b/id/10712345-L.jpg', category:'Science'}
];

// ----- SHOW BOOKS BY CATEGORY -----
function showCategory(category){
    var list = document.getElementById('books');
    if(!list) return;
    list.innerHTML = '';
    var filtered = booksData.filter(function(b){ return b.category === category; });
    filtered.forEach(function(book){
        var div = document.createElement('div');
        div.className = 'book';
        div.innerHTML = '<h3>' + book.name + '</h3>' +
                        '<p>₹' + book.price + '</p>' +
                        '<button onclick="addToCart(' + book.id + ')">Add to Cart</button>';
        list.appendChild(div);
    });
}

// ----- LOAD CART PAGE -----
function loadCart(){
    var cartItems = document.getElementById('cart-items');
    var totalEl = document.getElementById('total');
    if(!cartItems || !totalEl) return;
    cartItems.innerHTML = '';
    var total = 0;
    cart.forEach(function(item){
        var li = document.createElement('li');
        li.textContent = item.name + ' - ₹' + item.price;
        cartItems.appendChild(li);
        total += item.price;
    });
    totalEl.textContent = total;
}

function checkout(){
    localStorage.setItem('total', cart.reduce(function(sum, item){ return sum + item.price; },0));
    window.location.href = 'payment.html';
}

// ----- PAYMENT PAGE -----
function loadPayment(){
    var amountEl = document.getElementById('amount');
    if(amountEl) amountEl.textContent = localStorage.getItem('total') || 0;
}

function pay(){
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const currCart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = localStorage.getItem('total');

    orders.push({
        items: currCart,
        total: total,
        date: new Date().toLocaleString()
    });

    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');
    localStorage.removeItem('total');

    alert('Payment Successful! Order saved.');
    window.location.href = 'orders.html';
}function makePayment(){
    const card = document.getElementById('cardNumber').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if(card === '' || expiry === '' || cvv === ''){
        alert("Please fill all payment details");
        return;
    }

    // Get cart & orders
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    if(cart.length === 0){
        alert("Cart is empty");
        return;
    }

    // Calculate total
    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // Create order
    let newOrder = {
        date: new Date().toLocaleString(),
        total: total,
        items: cart
    };

    orders.push(newOrder);

    // Save order & clear cart
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');

    alert("Payment Successful!");
    window.location.href = "home.html";
}

function loadDashboard(){
    var mobile = localStorage.getItem('mobile');
    var orders = JSON.parse(localStorage.getItem('orders') || '[]');

    var dashMobileEl = document.getElementById('dashMobile');
    var dashOrdersEl = document.getElementById('dashOrders');
    if(dashMobileEl) dashMobileEl.textContent = mobile || 'Guest';
    if(dashOrdersEl) dashOrdersEl.textContent = orders.length;

    // Optional: show recent orders
    var recent = document.getElementById('recent-orders');
    if(recent){
        recent.innerHTML = '';
        if(orders.length === 0){
            recent.innerHTML = '<p>No orders yet</p>';
        } else {
            orders.slice(-2).reverse().forEach(function(o){
                var p = document.createElement('p');
                p.textContent = '₹' + o.total + ' | ' + o.date;
                recent.appendChild(p);
            });
        }
    }
}

// Call this in home.html (guarded)
try { loadDashboard(); } catch(e) { /* no-op if elements missing */ }

function loadProfile(){
    const mobile = localStorage.getItem('mobile');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    var userMobileEl = document.getElementById('userMobile');
    var userOrdersEl = document.getElementById('userOrders');
    if(userMobileEl) userMobileEl.textContent = mobile ? mobile : 'Not logged in';
    if(userOrdersEl) userOrdersEl.textContent = orders.length;function loadProfile(){
    const mobile = localStorage.getItem('mobile');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if(!mobile){
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    document.getElementById('userMobile').textContent = mobile;
    document.getElementById('userOrders').textContent = orders.length;
}
}
function filterBooks(category){
    // Save selected category
    localStorage.setItem("selectedCategory", category);

    // Redirect to books section / page
    window.location.href = "home.html#books";
}function showBooks(category){
    document.querySelectorAll(".book-card").forEach(card => {
        if(card.dataset.category === category || category === "all"){
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}window.onload = function(){
    const cat = localStorage.getItem("selectedCategory");
    if(cat){
        showBooks(cat);
    }
};