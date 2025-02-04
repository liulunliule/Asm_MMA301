import Chart from '@/components/Chart';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function Statistics() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  return (
    <View style={{ padding: 16 }}>
    <Chart data={data} />
  </View>
  );
}