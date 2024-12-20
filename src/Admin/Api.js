// src\Admin\api.js
export const addProduct = async (productData) => {
  const response = await fetch("http://localhost:3001/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  const result = await response.json();
  return result;
};

export const getCategories = async () => {
  const response = await fetch("http://localhost:3001/categories");
  const categories = await response.json();
  return categories;
};

export const editProduct = async (productData, productId) => {
  const response = await fetch(`http://localhost:3001/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  const result = await response.json();
  return result;
};

export const deleteProduct = async (productId) => {
  const response = await fetch(`http://localhost:3001/products/${productId}`, {
    method: "DELETE",
  });
  const result = await response.json();
  return result;
};

