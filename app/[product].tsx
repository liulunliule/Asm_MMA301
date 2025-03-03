import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProductDetails() {
  const { product } = useLocalSearchParams<{ product: string }>();

  // Giả sử `product` là một chuỗi JSON chứa thông tin sản phẩm
  const productData = JSON.parse(product);

  return (
    <View style={styles.container}>
      <Image source={{ uri: productData.productImage }} style={styles.image} />
      <Text style={styles.name}>{productData.productName}</Text>
      <Text style={styles.price}>${productData.price}</Text>
      <Text style={styles.description}>Product ID: {productData.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  price: {
    fontSize: 20,
    color: '#888',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
});