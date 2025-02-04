// services/api.ts
import axios from 'axios';

const API_URL = 'https://67a28947409de5ed5255aeed.mockapi.io/api/v1/Product';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// export const fetchProducts = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       return [];
//     }
//   };