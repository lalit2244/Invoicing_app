// File: frontend/src/utils/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get headers with JWT token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Login API call
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
};

// Get texts for a page
export const getTexts = async (page, language) => {
  const response = await fetch(`${API_BASE_URL}/texts/${page}/${language}`);

  if (!response.ok) {
    throw new Error('Failed to fetch texts');
  }

  return response.json();
};

// Get menu texts
export const getMenuTexts = async (language) => {
  const response = await fetch(`${API_BASE_URL}/texts/menu/${language}`);

  if (!response.ok) {
    throw new Error('Failed to fetch menu texts');
  }

  return response.json();
};

// Get all products
export const getAllProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/pricelist`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};

// Update a product
export const updateProduct = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/pricelist/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
};

// Create a product
export const createProduct = async (data) => {
  const response = await fetch(`${API_BASE_URL}/pricelist`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
};

// Delete a product
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/pricelist/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }

  return response.json();
};