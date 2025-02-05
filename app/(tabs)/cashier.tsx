import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { useOrderList } from "../../contexts/OrderContext";
import { createOrder } from "../../services/api";
import * as Print from 'expo-print'; // Thay thế react-native-html-to-pdf bằng expo-print
import * as Sharing from 'expo-sharing'; // Để chia sẻ file PDF

export default function Cashier() {
  const {
    orderList,
    increaseQuantity,
    decreaseQuantity,
    removeFromOrder,
    removeAllOrders,
  } = useOrderList();
  const [modalVisible, setModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const calculateTotal = () => {
    return orderList.reduce((total, item) => {
      const price = parseFloat(item.product.price);
      return total + price * item.quantity;
    }, 0);
  };

  const handleConfirmOrder = async () => {
    if (orderList.length === 0) {
      Alert.alert("Error", "No products in the order list.");
      return;
    }

    try {
      const total = calculateTotal().toFixed(2);

      const orderData = {
        createdAt: new Date().toISOString(),
        Products: orderList.map((item) => ({
          productId: item.product.id,
          productName: item.product.productName,
          price: item.product.price,
          quantity: item.quantity,
        })),
        Total: total,
        id: Math.floor(Math.random() * 1000).toString(), // Tạo ID ngẫu nhiên cho đơn hàng
      };

      await createOrder(orderData);

      setOrderDetails(orderData);
      setModalVisible(true);

      removeAllOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
      Alert.alert("Error", "An error occurred while saving the order.");
    }
  };

  const handlePrintBill = async () => {
    if (!orderDetails) return;

    // Tạo nội dung HTML cho hóa đơn
    const htmlContent = `
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 20px;
            }
            .modalView {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .modalTitle {
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 15px;
            }
            .modalText {
              font-size: 16px;
              margin-bottom: 10px;
            }
            .tableHeader {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #ccc;
              padding: 8px 0;
              margin-bottom: 8px;
            }
            .tableHeaderText {
              font-size: 16px;
              font-weight: bold;
              flex: 1;
              text-align: left;
            }
            .tableRow {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .totalAmountContainer {
              margin-top: 16px;
              padding-top: 16px;
              border-top: 1px solid #ccc;
              text-align: right;
            }
            .totalAmountText {
              font-size: 18px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="modalView">
            <div class="modalTitle">Order Details</div>
            <div class="modalText">Order ID: ${orderDetails.id}</div>
            <div class="modalText">Date: ${new Date(orderDetails.createdAt).toLocaleString()}</div>
  
            <!-- Table Header -->
            <div class="tableHeader">
              <div class="tableHeaderText" style="flex: 2;">Product Name & Price</div>
              <div class="tableHeaderText" style="flex: 1;">Quantity</div>
              <div class="tableHeaderText" style="flex: 1;">Total</div>
            </div>
  
            <!-- Table Rows -->
            ${orderDetails.Products.map(
      (product) => `
              <div class="tableRow">
                <div style="flex: 2;">
                  <div class="modalText">${product.productName}</div>
                  <div class="modalText">$${product.price}</div>
                </div>
                <div class="modalText" style="flex: 1; text-align: center;">${product.quantity}</div>
                <div class="modalText" style="flex: 1; text-align: right;">
                  $${(product.price * product.quantity).toFixed(2)}
                </div>
              </div>
            `
    ).join('')}
  
            <!-- Total Amount -->
            <div class="totalAmountContainer">
              <div class="totalAmountText">Total: $${orderDetails.Total}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Tạo file PDF từ HTML
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Chia sẻ file PDF
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Print Bill' });

      Alert.alert('Success', 'PDF has been generated and shared.');
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order List</Text>
      <FlatList
        data={orderList}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.name}>{item.product.productName}</Text>
              <Text style={styles.price}>${item.product.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(item.product.id)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(item.product.id)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromOrder(item.product.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: ${calculateTotal().toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmOrder}
      >
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Order Details</Text>
            {orderDetails && (
              <>
                <Text style={styles.modalText}>
                  Order ID: {orderDetails.id}
                </Text>
                <Text style={styles.modalText}>
                  Date: {new Date(orderDetails.createdAt).toLocaleString()}
                </Text>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, { flex: 2 }]}>Product Name & Price</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1 }]}>Quantity</Text>
                  <Text style={[styles.tableHeaderText, { flex: 1 }]}>Total</Text>
                </View>

                {/* Table Rows */}
                {orderDetails.Products.map((product, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.modalText}>{product.productName}</Text>
                      <Text style={styles.modalText}>${product.price}</Text>
                    </View>
                    <Text style={[styles.modalText, { flex: 1, textAlign: 'center' }]}>{product.quantity}</Text>
                    <Text style={[styles.modalText, { flex: 1, textAlign: 'right' }]}>
                      ${(product.price * product.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}

                {/* Total Amount */}
                <View style={styles.totalAmountContainer}>
                  <Text style={styles.totalAmountText}>
                    Total: ${orderDetails.Total}
                  </Text>
                </View>
              </>
            )}

            {/* Print Bill Button */}
            <TouchableOpacity
              style={styles.printButton}
              onPress={handlePrintBill}
            >
              <Text style={styles.printButtonText}>Print Bill</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    color: "#888",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  removeButton: {
    padding: 8,
    backgroundColor: "#ff4444",
    borderRadius: 4,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  productItem: {
    marginBottom: 10,
    width: "100%",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalAmountContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'flex-end',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  printButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  printButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});