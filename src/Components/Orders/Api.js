const BASE_URL_PRODUCTS = 'http://localhost:3001/products';
const BASE_URL_ORDERS = 'http://localhost:3002/orders';

export const getProducts = async () => {
  const response = await fetch(BASE_URL_PRODUCTS);
  if (!response.ok) throw new Error('Failed to fetch products.');
  return response.json();
};

export const createOrder = async (order) => {
  const response = await fetch(BASE_URL_ORDERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error('Failed to create order.');
};

export const getOrders = async () => {
  const response = await fetch(BASE_URL_ORDERS);
  if (!response.ok) throw new Error('Failed to fetch orders.');
  return response.json();
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${BASE_URL_ORDERS}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update order status.');
};

export const updateProductQuantity = async (id, newQuantity) => {
  const response = await fetch(`${BASE_URL_PRODUCTS}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: newQuantity }),
  });
  if (!response.ok) throw new Error('Failed to update product quantity.');
};
