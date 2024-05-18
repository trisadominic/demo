/*let navLinks = document.getElementById("navLinks");
function showMenu(){
    navLinks.style.top = '0';
}
function hideMenu(){
    navLinks.style.top = '-800px'
}
*/
document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.getElementById('cart-button');
  
    cartButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default action of the link
      window.location.href = './cart.html'; // Redirect to the cart page
    });
  });
  