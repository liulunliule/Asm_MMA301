import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { fetchOrders } from '@/services/api';

interface Order {
    id: string;
    createdAt: string;
    Products: Array<{
        productId: string;
        productName: string;
        price: string;
        quantity: number;
    }>;
    Total: string;
}

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadOrders = async () => {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

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
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.orderCard}>
                        <Text style={styles.dateText}>
                            {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>

                        {/* Danh sách sản phẩm */}
                        {item.Products.map((product) => (
                            <View key={product.productId} style={styles.productItem}>
                                <Text style={styles.productName}>{product.productName}</Text>
                                <Text style={styles.productDetails}>
                                    {product.quantity} x ${product.price}
                                </Text>
                            </View>
                        ))}

                        <Text style={styles.totalText}>Total: ${item.Total}</Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0000ff']} // Màu sắc của indicator
                        tintColor="#0000ff" // Màu sắc của indicator (iOS)
                    />
                }
            />
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
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#666',
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    productName: {
        fontSize: 14,
    },
    productDetails: {
        fontSize: 14,
        color: '#888',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 12,
        color: '#2ecc71',
    },
});