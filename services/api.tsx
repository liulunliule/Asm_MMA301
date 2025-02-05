// services/api.ts
import axios from 'axios';

const PRODUCT_API_URL = 'https://67a28947409de5ed5255aeed.mockapi.io/api/v1/Product';
const ORDER_API_URL = 'https://67a28947409de5ed5255aeed.mockapi.io/api/v1/Order';

// Lấy danh sách sản phẩm
export const fetchProducts = async () => {
  try {
    const response = await axios.get(PRODUCT_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Tạo đơn hàng mới
export const createOrder = async (orderData: { Products: any[]; Total: string }) => {
  try {
    const response = await axios.post(ORDER_API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};