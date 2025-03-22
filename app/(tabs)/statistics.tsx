import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { fetchOrders } from '@/services/api';

const screenWidth = Dimensions.get("window").width;

export default function Statistics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State để kiểm soát trạng thái refresh

  // Hàm tải dữ liệu đơn hàng
  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  // Gọi hàm loadOrders khi component được mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Hàm xử lý khi người dùng kéo để refresh
  const onRefresh = async () => {
    setRefreshing(true); // Bật trạng thái refreshing
    await loadOrders(); // Tải lại dữ liệu
    setRefreshing(false); // Tắt trạng thái refreshing
  };

  // Hiển thị loading indicator nếu đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  // Tính toán dữ liệu cho các biểu đồ và thống kê
  const today = new Date();
  const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today.toDateString());
  const todayRevenue = Math.round(todayOrders.reduce((acc, order) => acc + parseFloat(order.Total), 0));

  // Lấy dữ liệu 7 ngày gần nhất
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }).replace('-', '/'));
    }
    return days;
  };

  const last7DaysLabels = getLast7Days(); // Nhãn cho 7 ngày gần nhất
  const last7DaysData = last7DaysLabels.map(date => {
    const ordersForDate = orders.filter(order => {
      const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }).replace('-', '/');
      return orderDate === date;
    });
    return ordersForDate.reduce((sum, order) => sum + Math.round(parseFloat(order.Total)), 0);
  });

  const now = new Date();
  const hourlyLabels = Array.from({ length: now.getHours() + 1 }, (_, i) => `${i + 1}h`);
  const hourlyRevenueData = new Array(now.getHours() + 1).fill(0);
  todayOrders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    hourlyRevenueData[hour] += Math.round(parseFloat(order.Total));
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing} // Trạng thái refreshing
          onRefresh={onRefresh} // Hàm xử lý khi refresh
          colors={['#27ae60']} // Màu của indicator (Android)
          tintColor="#27ae60" // Màu của indicator (iOS)
        />
      }
    >
      <Text style={styles.title}>📊 Sales Statistics</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Total Revenue</Text>
          <Text style={styles.statValue}>${last7DaysData.reduce((a, b) => a + b, 0)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Orders Today</Text>
          <Text style={styles.statValue}>{todayOrders.length}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Today's Revenue</Text>
          <Text style={styles.statValue}>${todayRevenue}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Week's Revenue</Text>
        <BarChart
          data={{
            labels: last7DaysLabels,
            datasets: [{ data: last7DaysData }],
          }}
          width={screenWidth - 32}
          height={250}
          fromZero
          showBarTops={false}
          withInnerLines={false}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.6,
          }}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: 'rgba(41, 128, 185, 1)' }]}>Today's Revenue by Hour</Text>
        <LineChart
          data={{
            labels: hourlyLabels,
            datasets: [{
              data: hourlyRevenueData,
              color: (opacity = 1) => `rgba(41, 128, 185, ${opacity})`, // Blue color
              strokeWidth: 3,
            }],
          }}
          width={screenWidth - 32}
          height={250}
          fromZero
          withInnerLines={false}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(41, 128, 185, ${opacity})`, // Blue color for the line
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ecf0f1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#e74c3c',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    width: '30%',
  },
  statTitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#27ae60',
  },
});