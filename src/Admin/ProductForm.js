import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct, editProduct, getCategories } from "./Api";
import { fetchProducts } from "../store/productsSlice"; // Import fetchProducts action
import { notification } from "antd";

const ProductForm = ({ mode, product, onClose, refreshList }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    price: 0,
    category: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log("Failed to fetch categories:", error);
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
    }
  }, [mode, product]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (mode === "edit" && product) {
      console.log("Editing product with ID:", product.id); // Debugging
      await editProduct(formData, product.id); // Fixed parameter order
      console.log("Product updated successfully.");
      notification.open({message:'Product updated successfully.'});
    } else if (mode === "add") {
      await addProduct(formData);
      console.log("Product added successfully.");
      notification.open({message:'Product added successfully.'});
    }
    refreshList();
    dispatch(fetchProducts()); // Trigger product list refresh
    onClose();
  } catch (error) {
    console.log("Failed to save product:", error);
  }
};

  return (
    <form className="product-form" onSubmit={handleSubmit} >
      <label className="input-label">Name</label>
      <input
        className="input-field"
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <label className="input-label">SKU</label>
      <input
        className="input-field"
        type="text"
        placeholder="SKU"
        value={formData.sku}
        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        required
      />

      <label className="input-label">Quantity</label>
      <input
        className="input-field"
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) =>
          setFormData({ ...formData, quantity: parseInt(e.target.value) })
        }
        required
      />

      <label className="input-label">Price</label>
      <input
        className="input-field"
        type="number"
        placeholder="Price"
        step="0.01"
        value={formData.price}
        onChange={(e) =>
          setFormData({ ...formData, price: parseFloat(e.target.value) })
        }
        required
      />

      <label className="input-label">Category</label>
      <select
        className="input-field"
        value={formData.category}
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value })
        }
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

      <div className="form-buttons">
        <button className="button" type="submit">
          {mode === "edit" ? "Update Product" : "Add Product"}
        </button>
        <button className="button cancel-btn" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
