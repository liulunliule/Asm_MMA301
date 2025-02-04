// contexts/OrderContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface Product {
  id: string;
  productName: string;
  price: string;
  productImage: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface OrderContextType {
  orderList: OrderItem[];
  addToOrder: (product: Product) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromOrder: (productId: string) => void;
  removeAllOrders: () => void;
}

export const OrderContext = createContext<OrderContextType>({
  orderList: [],
  addToOrder: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  removeFromOrder: () => {},
  removeAllOrders: () => {},
});

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderList, setOrderList] = useState<OrderItem[]>([]);

  const addToOrder = (product: Product) => {
    setOrderList((prevOrderList) => {
      const existingItem = prevOrderList.find((item) => item.product.id === product.id);

      if (existingItem) {
        return prevOrderList.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevOrderList, { product, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (productId: string) => {
    setOrderList((prevOrderList) =>
      prevOrderList.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setOrderList((prevOrderList) =>
      prevOrderList
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromOrder = (productId: string) => {
    setOrderList((prevOrderList) =>
      prevOrderList.filter((item) => item.product.id !== productId)
    );
  };

  const removeAllOrders = () => {
    setOrderList([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orderList,
        addToOrder,
        increaseQuantity,
        decreaseQuantity,
        removeFromOrder,
        removeAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderList = () => React.useContext(OrderContext);