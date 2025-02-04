import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <View>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Sales Chart</Text>
      <LineChart
        data={data}
        width={300}
        height={200}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
      />
    </View>
  );
};

export default Chart;