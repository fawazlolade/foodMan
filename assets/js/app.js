class Product {
    constructor(name, expiryDay, id) {    
        this.name = name;
        this.expiryDay = expiryDay;
        this.id = id;
    }
}

class UI{
    static displayProducts() {
        const products = StoreProducts.getProducts();
        products.forEach((product) => UI.addProduct(product));
    }
    //add product
    static addProduct(product) {
        const productList = document.querySelector('#product-list'); 
        const createProduct = document.createElement('tr');
        let status, currentDay, expiryDay, distance, daysRemaining;
        status = document.createElement('div').innerHTML;

        currentDay = new Date();
        expiryDay = new Date(product.expiryDay);
        distance = expiryDay - currentDay;
        daysRemaining = Math.floor(distance / (1000*60*60*24)); //get the number of days left for the product to expire

        if(daysRemaining < 1) {
            status = `<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>Expired`;  
        }
        else if(daysRemaining < 4) {
            status =  `<i class="fa fa-bullhorn" aria-hidden="true"></i>Warning`;
        }  
        else{
            status = `<i class="fa fa-check-square" aria-hidden="true"></i>Good`;
        }
        
      
        createProduct.innerHTML = `
            <td>${status}</td>
            <td>${product.name}</td>
            <td>${product.expiryDay}</td>
            <td>${product.id}</td>
            <td><a href="#" class="action-btns delete">Delete</a></td>
            `;
            productList.appendChild(createProduct);
        }

        //notification 
    static showMessage(message, className){
        const div = document.createElement('div');
        const form = document.querySelector('#product_table');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.product-container');
        container.insertBefore(div, form);

        setTimeout(() => {
            div.remove();
        }, 1000);
    }

    //delete product
    static deleteProduct(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
       
    }

    static clearFields(){
        document.getElementById('id').value = '';
        document.getElementById('name').value = '';
        document.getElementById('expiryDay').value = '';        
    }

}

class StoreProducts {
    static getProducts() {
        let products;
        if(localStorage.getItem('products') === null) {
            products = [];
        }
        else{
            products = JSON.parse(localStorage.getItem('products'));
        }
        return products;
    }

    static addProduct(product) {
        const products = StoreProducts.getProducts();
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }

    static removeProduct(id) {
        const products = StoreProducts.getProducts();
        products.forEach((product, index) => {
            if(product.id === id) {   
                products.splice(index, 1);
            }
        });
        localStorage.setItem('products', JSON.stringify(products));
    }
}




document.addEventListener('DOMContentLoaded', UI.displayProducts); //display products on page load

document.querySelector('#product-form').addEventListener('submit', (e) => {

    e.preventDefault();

    //get form values 
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const expiryDay = document.getElementById('expiryDay').value;
    
    if(id === ""  || name === "" || expiryDay === "") {
        UI.showMessage("Fill in details", 'danger');
    }
    else{
         const product = new Product(name, expiryDay, id);
         UI.addProduct(product);
         StoreProducts.addProduct(product);
         UI.showMessage("Product successfully entered", 'success');
         UI.clearFields();
    }
   

})


document.querySelector('#product-list').addEventListener('click', (e) => {
    if(e.target.classList.contains('delete')) {
        if(confirm('Do you want to delete this product?')) {
            StoreProducts.removeProduct(e.target.parentElement.previousElementSibling.textContent);
            UI.deleteProduct(e.target);
            UI.showMessage("Product has been deleted", 'danger');
        }
    }
    
});


//search products
function searchProducts() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("product-table");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }



//display add product form
const formContainer = document.querySelector('.form-container');
const addButton = document.querySelector('.add-btn');
const closeButton = document.querySelector('#close-btn');
addButton.addEventListener('click', () => {
    formContainer.classList.toggle('show');
})
closeButton.addEventListener('click', () => {
    formContainer.classList.remove('show');
});