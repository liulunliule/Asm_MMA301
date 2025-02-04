// app/_layout.tsx
import { Stack } from 'expo-router';
import { OrderProvider } from '../contexts/OrderContext';

export default function Layout() {
  return (
    <OrderProvider>
      <Stack>
        {/* Màn hình chính (Home) */}
        <Stack.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false, // Ẩn header nếu không cần thiết
          }}
        />

        {/* Các tab (Home và Cashier) */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false, // Ẩn header cho các tab
          }}
        />

        <Stack.Screen
          name="[product]"
          options={{
            title: 'Product Details', 
          }}
        />
      </Stack>
    </OrderProvider>
  );
}