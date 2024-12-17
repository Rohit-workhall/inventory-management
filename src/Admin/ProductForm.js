import { useState, useEffect } from 'react';
import { addProduct, editProduct, getCategories } from './Api';

const ProductForm = ({ mode, product, onClose, refreshList }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 0,
    price: 0,
    category: '',
  });
  const [categories, setCategories] = useState([]); 
  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data); 
      } catch (error) {
        console.log('Failed to fetch categories:', error);
      }
    };

    fetchCategories();

    if (mode === "edit" && product) {
    
      setFormData({
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        price: product.price,
        category: product.category,
      });
    } else if (mode === "add") {
    
      setFormData({
        name: '',
        sku: '',
        quantity: 0,
        price: 0,
        category: '',
      });
    }
  }, [mode, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit" && product) {
        await editProduct(product.id, formData); 
        console.log('Product updated successfully.');
      } else if (mode === "add") {
        await addProduct(formData);
        console.log('Product added successfully.');
      }
      refreshList(); 
      onClose(); 
    } catch (error) {
      console.log('Failed to save product:', error);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input
        className="input-field"
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        className="input-field"
        type="text"
        placeholder="SKU"
        value={formData.sku}
        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        required
      />
      <input
        className="input-field"
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
        required
      />
      <input
        className="input-field"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
        required
      />
      <select
        className="input-field"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button className="button" type="submit">
        {mode === "edit" ? "Update Product" : "Add Product"}
      </button>
      <button className="button cancel-btn" type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default ProductForm;
