const API_BASE_URL = "http://localhost:5006/api";

// Helper function to handle requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// API methods
export const api = {
  auth: {
    register: (userData) => request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
    login: (credentials) => request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
    getMe: () => request("/auth/me"),
  },
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/products/${id}`),
    create: (productData) => request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),
  },
  cart: {
    get: () => request("/cart"),
    add: (productId, quantity) => request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),
    remove: (productId) => request(`/cart/${productId}`, {
      method: "DELETE",
    }),
  },
  orders: {
    create: (shippingAddress) => request("/orders", {
      method: "POST",
      body: JSON.stringify({ shippingAddress }),
    }),
    getAll: () => request("/orders"),
    getById: (id) => request(`/orders/${id}`),
  },
};
