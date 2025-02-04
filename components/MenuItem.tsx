// components/MenuItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

interface MenuItemProps {
  productName: string;
  price: string;
  productImage: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ productName, price, productImage, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Image source={{ uri: productImage }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{productName}</Text>
          <Text style={styles.price}>${price}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  details: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
});

export default MenuItem;