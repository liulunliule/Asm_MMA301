import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
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
  const { addToOrder } = useOrderList();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) {
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
