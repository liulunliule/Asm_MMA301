import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { fetchOrders } from '@/services/api';

const screenWidth = Dimensions.get("window").width;

export default function Statistics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  const today = new Date();
  const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today.toDateString());
  const todayRevenue = Math.round(todayOrders.reduce((acc, order) => acc + parseFloat(order.Total), 0));

  const weeklyData = orders.map(order => ({
    date: new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }).replace('-', '/'),
    total: Math.round(parseFloat(order.Total))
  }));

  const uniqueWeeklyLabels = [...new Set(weeklyData.map(item => item.date))];
  const weeklyRevenueData = uniqueWeeklyLabels.map(date => {
    return weeklyData.filter(item => item.date === date).reduce((sum, item) => sum + item.total, 0);
  });

  const now = new Date();
  const hourlyLabels = Array.from({ length: now.getHours() + 1 }, (_, i) => `${i + 1}h`);
  const hourlyRevenueData = new Array(now.getHours() + 1).fill(0);
  todayOrders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    hourlyRevenueData[hour] += Math.round(parseFloat(order.Total));
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Sales Statistics</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Total Revenue</Text>
          <Text style={styles.statValue}>${weeklyRevenueData.reduce((a, b) => a + b, 0)}</Text>
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
        <Text style={styles.chartTitle}>Weekly Revenue</Text>
        <BarChart
          data={{
            labels: uniqueWeeklyLabels,
            datasets: [{ data: weeklyRevenueData }],
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
    borderWidth: 0, // Border thickness
    borderRadius: 10, // Rounded corners
    backgroundColor: '#ffffff', // White background to ensure it looks clean
    elevation: 3, // Shadow effect (for Android)
    shadowColor: '#000', // Shadow (for iOS)
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
