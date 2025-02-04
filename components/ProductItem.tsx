import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

interface ProductItemProps {
  name: string;
  price: number;
  onRemove: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ name, price, onRemove }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{name}</Title>
        <Paragraph>${price}</Paragraph>
        <Button title="Remove" onPress={onRemove} />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
});

export default ProductItem;