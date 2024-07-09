import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import "./Productdetails.css";


function ProductDetail() {
  const { productId } = useParams(); // Extract the product ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const productImageRef = useRef(null);

  useEffect(() => {
    // Function to fetch product details based on productId
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Render function to display content
  const renderContent = () => {
    if (!product) {
      return <div>Loading...</div>;
    }

    return (
      <div>
     <Header />
      <div className="product-detail">
        <div ref={productImageRef} style={{ position: 'relative' }}>
          <img src={`${process.env.PUBLIC_URL}/${product.image}`} alt={product.name} style={{ width: '100%' }} />
         
        </div>
        <h2>{product.name}</h2>
        <p>Price: ${product.price}</p>
        <p>{product.description}</p>
      </div>
      <Footer />
      </div>
  
    );
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default ProductDetail;