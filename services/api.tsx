import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';
const PRODUCT_API_URL = `${API_BASE_URL}/Product`;
const ORDER_API_URL = `${API_BASE_URL}/Order`;

export const fetchProducts = async () => {
  try {
    const response = await axios.get(PRODUCT_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const createOrder = async (orderData: { Products: any[]; Total: string }) => {
  try {
    const response = await axios.post(ORDER_API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await axios.get(ORDER_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};
