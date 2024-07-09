import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/Header.js";
import Footer from "./component/Footer.js";
import Sidebar from "./component/LeftPanel.js";
import ImageGallery from "./component/ImageGallery.js";
import ImageUploader from "./component/ImageUploader.js";
import "./App.css";

const App = () => {
  const [albums, setAlbums] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(6);
  

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/getall?page=${currentPage}&size=${pageSize}`
        );
        const data = await response.json();
        setAlbums(data.content);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="content">
          {/* <Sidebar albums={albums} /> */}
          <Routes>
            <Route
              exact
              path="/"
              element={
                <>
                  <Sidebar albums={albums} />
                  <ImageGallery albums={albums} />
                </>
              }
            />
            <Route path="/upload/:productId" element={<ImageUploader />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
