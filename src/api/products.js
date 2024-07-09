const currentPage = 1;
const pageSize = 10;

fetch(`http://localhost:8080/api/products/getall?page=${currentPage}&size=${pageSize}`)
    .then(response => response.json())
    .then(data => {
        const product = data.content;
        console.log(product);
        // Do something with the product data
    })
    .catch(error => {
        console.error('Error:', error);
    });