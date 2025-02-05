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
            headerShown: false,
          }}
        />

        {/* Các tab (Home và Cashier) */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
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