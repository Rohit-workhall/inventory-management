import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Use useParams to get the product ID from the URL

const ProductDetail = () => {
  const { productId } = useParams(); // Extract productId from URL
  const [product, setProduct] = useState(null);

  // Fetch product data based on productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3001/products/${productId}`); // Replace with your API endpoint
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", height: "auto", marginBottom: "20px" }}
      />
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
      <p><strong>Availability:</strong> {product.quantity === 0 ? "Out of Stock" : product.quantity <= 10 ? "Limited Stock" : "In Stock"}</p>
      <p><strong>Category:</strong> {product.category}</p>
    </div>
  );
};

export default ProductDetail;
