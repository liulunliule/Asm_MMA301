// app/(tabs)/cashier.tsx
import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useOrderList } from '../../contexts/OrderContext';
import axios from 'axios';

export default function Cashier() {
  const { orderList, increaseQuantity, decreaseQuantity, removeFromOrder } = useOrderList();

  const handleConfirmOrder = async () => {
    if (orderList.length === 0) {
      Alert.alert('Error', 'No products in the order list.');
      return;
    }

    try {
      // Gửi yêu cầu POST để tạo đơn hàng mới
      const response = await axios.post(
        'https://67a28947409de5ed5255aeed.mockapi.io/api/v1/Order',
        {
          Products: orderList.map((item) => ({
            productId: item.product.id,
            productName: item.product.productName,
            price: item.product.price,
            quantity: item.quantity,
          })),
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Order confirmed and saved successfully!');
        // Xóa danh sách đơn hàng sau khi xác nhận thành công
        removeAllOrders();
      } else {
        Alert.alert('Error', 'Failed to save the order.');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      Alert.alert('Error', 'An error occurred while saving the order.');
    }
  };

  const removeAllOrders = () => {
    // Xóa tất cả sản phẩm khỏi orderList
    orderList.forEach((item) => removeFromOrder(item.product.id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order List</Text>
      <FlatList
        data={orderList}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.product.productName}</Text>
            <Text style={styles.price}>${item.product.price}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => decreaseQuantity(item.product.id)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => increaseQuantity(item.product.id)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromOrder(item.product.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  removeButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ff4444',
    borderRadius: 4,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});