import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from './Api';

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.log('Failed to fetch products.');
    }
  };

  const handleDelete = async (id) => {
  
    const isConfirmed = window.confirm('Are you sure you want to delete this product?');
    if (isConfirmed) {
      try {
        await deleteProduct(id);
        console.log('Product deleted successfully.');
        fetchProducts(); 
      } catch (error) {
        console.log('Failed to delete product.');
      }
    }
  };

  return (
    <table className="product-list-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>{product.quantity}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>{product.category}</td>
            <td>
              <button className="button" onClick={() => onEdit(product)}>Edit</button>
              <button className="button delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductList;
