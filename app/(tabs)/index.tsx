import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import MenuItem from '../../components/MenuItem';
import { fetchProducts } from '../../services/api';
import { useOrderList } from '../../contexts/OrderContext';
import Toast from 'react-native-toast-message';

interface Product {
  id: string;
  productName: string;
  price: string;
  productImage: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State để kiểm soát trạng thái refresh
  const { addToOrder } = useOrderList();

  // Hàm tải dữ liệu sản phẩm
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load products. Please try again.',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm loadProducts khi component được mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Hàm xử lý khi người dùng kéo để refresh
  const onRefresh = async () => {
    setRefreshing(true); // Bật trạng thái refreshing
    await loadProducts(); // Tải lại dữ liệu
    setRefreshing(false); // Tắt trạng thái refreshing
  };

  // Hiển thị loading indicator nếu đang tải dữ liệu
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItem
            productName={item.productName}
            price={item.price}
            productImage={item.productImage}
            onPress={() => {
              addToOrder(item);
              Toast.show({
                type: 'success',
                text1: 'Added to order',
                text2: `${item.productName} added successfully!`,
                position: 'top',
              });
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Trạng thái refreshing
            onRefresh={onRefresh} // Hàm xử lý khi refresh
            colors={['#0000ff']} // Màu của indicator (Android)
            tintColor="#0000ff" // Màu của indicator (iOS)
          />
        }
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});