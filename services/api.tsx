import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const REGISTER_BASE_URL = process.env.EXPO_PUBLIC_REGISTER_BASE_URL;

const PRODUCT_API_URL = `${API_BASE_URL}/Product`;
const ORDER_API_URL = `${API_BASE_URL}/Order`;
const REGISTER_API_URL = `${REGISTER_BASE_URL}/Register`;

// Hàm lấy danh sách sản phẩm
export const fetchProducts = async () => {
  try {
    const response = await axios.get(PRODUCT_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Hàm tạo đơn hàng
export const createOrder = async (orderData: { Products: any[]; Total: string }) => {
  try {
    const response = await axios.post(ORDER_API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Hàm lấy danh sách đơn hàng
export const fetchOrders = async () => {
  try {
    const response = await axios.get(ORDER_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Hàm đăng nhập
export const loginUser = async (username: string, password: string) => {
  try {
    // Gọi API để lấy danh sách người dùng
    const response = await axios.get(REGISTER_API_URL);
    const users = response.data;

    // Kiểm tra thông tin đăng nhập
    const user = users.find(
      (u: any) => u.name === username && u.pass === password
    );

    if (user) {
      return user; // Trả về thông tin người dùng nếu đăng nhập thành công
    } else {
      throw new Error('Invalid username or password.'); // Ném lỗi nếu thông tin không khớp
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Ném lỗi nếu có lỗi xảy ra trong quá trình đăng nhập
  }
};

// Hàm cập nhật vị trí của người dùng
export const updateUserLocation = async (userId: string, newLocation: { longitude: number; latitude: number }) => {
  try {
    // Lấy thông tin người dùng hiện tại
    const userResponse = await axios.get(`${REGISTER_API_URL}/${userId}`);
    const user = userResponse.data;

    // Thêm vị trí mới vào mảng location
    const updatedLocation = [...(user.location || []), [newLocation.longitude, newLocation.latitude]];

    // Cập nhật thông tin người dùng với vị trí mới
    const response = await axios.put(`${REGISTER_API_URL}/${userId}`, {
      ...user,
      location: updatedLocation,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating user location:', error);
    throw error;
  }
};