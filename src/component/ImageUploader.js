import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import Draggable from "react-draggable";
import "./ImageUploader.css";
import { Resizable } from 'react-resizable';



const ImageUploader = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const baseImageRef = useRef(null);
  const [productDetails, setProductDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
 
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.image-and-dropbox-container');
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('draggable', true);
      img.addEventListener('dragstart', handleDragStart, false);
      img.addEventListener('dragover', handleDragOver, false);
      img.addEventListener('drop', handleDrop, false);
    });

    function handleDragStart(e) {
      const rect = e.target.getBoundingClientRect();
      const offsetX = e.clientX - rect.left; // X position within the element.
      const offsetY = e.clientY - rect.top;  // Y position within the element.
      e.dataTransfer.setData('text/plain', JSON.stringify({ offsetX, offsetY }));
     
    }
    
    function handleDragOver(e) {
      e.preventDefault(); // Necessary to allow dropping
      // Calculate and restrict position within container
    }
  
    function handleDrop(e) {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const container = document.querySelector('.image-and-dropbox-container');
  const containerRect = container.getBoundingClientRect();

  // Calculate the image's new position within the container
  let newX = e.clientX - containerRect.left - data.offsetX;
  let newY = e.clientY - containerRect.top - data.offsetY;

  // Prevent the image from being moved outside the container
  newX = Math.max(newX, 0);
  newY = Math.max(newY, 0);
  newX = Math.min(newX, containerRect.width - e.target.offsetWidth);
  newY = Math.min(newY, containerRect.height - e.target.offsetHeight);

  // Update the image's position
  e.target.style.left = `${newX}px`;
  e.target.style.top = `${newY}px`;
}
  });

    
  
  const handleOrderNowClick = () => {
    setShowPopup(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, phone, quantity } = event.target.elements;
    console.log('Email:', email.value, 'Phone:', phone.value, 'Quantity:', quantity.value);
    // Here, you can add logic to process the order details
    setShowPopup(false); // Close the popup after submission
  };
  // Step 2: Create a function to fetch product details
const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    const data = await response.json();
    setProductDetails(data); // Update state with fetched data
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};

useEffect(() => {
  // Assuming productId is available in your component
  // Call the API when the component mounts or productId changes
  if (productId) {
    fetchProductDetails(productId);
  }
}, [productId]);

  // Function to handle file drop
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImages((prevImages) => [
          ...prevImages,
          {
            src: reader.result,
            x: baseImageRef.current.width / 2 - 50, // Initial x position
            y: baseImageRef.current.height / 2 - 50, // Initial y position
            title: `Image ${productId}`, // Example title based on imageType
            id: productId, // Example ID based on imageType
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Function to handle dragging of uploaded images
  const handleDrag = (index, e, data) => {
    setUploadedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = { ...newImages[index], x: data.x, y: data.y };
      return newImages;
    });
  };

  // Function to handle image download
  const handleDownload = () => {
    // Create a temporary canvas to draw all images
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const baseImage = baseImageRef.current;

    // Assuming baseImage and uploadedImages are already sized as they appear in UI
    // Calculate canvas size to fit both images
    // This example assumes the images are laid out horizontally side by side
    const totalWidth = baseImage.width + uploadedImages.reduce((acc, img) => acc + img.width, 0);
    const maxHeight = Math.max(baseImage.height, ...uploadedImages.map(img => img.height));

    canvas.width = totalWidth;
    canvas.height = maxHeight;

    // Draw base image on canvas
    ctx.drawImage(baseImage, 0, 0);

    // Track the x position for the next image
    let nextXPosition = baseImage.width;

    // Use Promise.all to handle multiple image loading asynchronously
    Promise.all(
      uploadedImages.map(({ src, x, y, width, height }) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Ensure CORS compatibility
          img.src = src;
          img.onload = () => {
            // Adjust x, y if necessary to position images as they appear in UI
            // Here, we simply place them side by side
            ctx.drawImage(img, nextXPosition, y, width, height);
            nextXPosition += width; // Update nextXPosition for the next image
            resolve(); // Resolve the promise once image is drawn
          };
          img.onerror = (error) => reject(error); // Handle any errors loading the image
        });
      })
    )
      .then(() => {
        // Once all images are drawn, create a download link for the canvas
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `combined-image-${Date.now()}.png`; // Use a timestamp for unique filename
        document.body.appendChild(link); // Append link to body temporarily to make it "clickable"
        link.click();
        document.body.removeChild(link); // Clean up by removing the link
      })
      .catch((error) => {
        console.error("Error loading images:", error);
      });
};

  // Effect to ensure all uploaded images are loaded before rendering
  useEffect(() => {
    const handleImageLoad = () => {
      setUploadedImages((prevImages) => [...prevImages]);
    };

    uploadedImages.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
    });
  }, [uploadedImages]);

  return (
    <div className="upload-main">
      <div className="buttons">
        <button onClick={() => navigate("/")}>Back</button>
        <button onClick={handleDownload}>Download</button>
      </div>

      <div className="image-container">
        {uploadedImages.map((image, index) => (
          <Draggable
            key={index}
            position={{ x: image.x, y: image.y }}
            onStop={(e, data) => handleDrag(index, e, data)}
          >
            <div className="uploaded-image-container">
           
              <img
                key={index}
                src={image.src}
                alt={`Uploaded ${index}`}
                className="image-size"
                style={{ width: "150px", height: "auto" }} // Set the width to 50px
              />
              
            </div>
          </Draggable>
        ))}

        {productDetails && (
          <div>
            <div className="parent-container">
              <div className="image-and-dropbox-container">
                <img
                  ref={baseImageRef}
                  src={`${process.env.PUBLIC_URL}/${productDetails.image}`}
                  alt={productDetails.name}
                  style={{
                    width: "500px",
                    height: "auto",
                    display: "block",
                    marginLeft: "0",
                  }}
                />
                {/* Assuming DragAndDropBox is a component or div for drag and drop functionality */}

                <Dropzone onDrop={onDrop} multiple>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                      <input {...getInputProps()} />
                      <p>Drop files here to upload</p>
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className="product-details">
                <p className="product-name">{productDetails.name}</p>
                <p className="product-desc">
                  <strong>Description</strong>: {productDetails.description}
                </p>
                <p className="product-desc">
                  <strong>Price</strong>: {productDetails.price}$
                </p>
                {/* Display other details as needed */}

                <button
                  type="button"
                  className="order-button"
                  onClick={handleOrderNowClick}
                >
                  Order Now
                </button>

                {showPopup && (
                  <div className="popup">
                    <form onSubmit={handleSubmit}>
                      <label>Email:</label>
                      <input type="email" name="email" required />
                      <label>Phone:</label>
                      <input type="tel" name="phone" required />
                      <label>Quantity:</label>
                      <input type="number" name="quantity" min="1" required />
                      <button type="submit">Submit Order</button>
                    </form>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
	