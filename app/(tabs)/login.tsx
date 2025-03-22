import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { loginUser, updateUserLocation } from '../../services/api';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Thông tin người dùng
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null); // Vị trí hiện tại
  const router = useRouter();

  // Hàm lấy vị trí của người dùng
  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to track your location.');
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return {
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    };
  };

  // Hàm đăng nhập
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      // Đăng nhập người dùng
      const user = await loginUser(username, password);
      if (user) {
        // Lấy vị trí của người dùng
        const location = await getUserLocation();
        if (location) {
          // Cập nhật vị trí mới vào mảng location của người dùng
          await updateUserLocation(user.id, location);

          // Lưu thông tin đăng nhập và vị trí vào AsyncStorage
          await AsyncStorage.setItem(
            'user',
            JSON.stringify({ ...user, location })
          );

          // Cập nhật state để hiển thị thông tin người dùng và bản đồ
          setUserInfo(user);
          setLocation({ latitude: location.latitude, longitude: location.longitude });

          Alert.alert('Success', 'Login successful!');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const handleLogout = async () => {
    try {
      // Xóa thông tin người dùng khỏi AsyncStorage
      await AsyncStorage.removeItem('user');

      // Đặt lại state
      setUserInfo(null);
      setLocation(null);

      Alert.alert('Success', 'You have been logged out.');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Phần đăng nhập */}
      {!userInfo ? (
        <>
          <MaterialIcons name="account-circle" size={100} color="#4CAF50" style={styles.icon} />
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <Button title="Login" onPress={handleLogin} />
          )}
        </>
      ) : (
        // Phần hiển thị thông tin người dùng và bản đồ sau khi đăng nhập
        <>
          <Text style={styles.userInfoTitle}>User Information</Text>
          <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
          <Text style={styles.userInfoText}>ID: {userInfo.id}</Text>

          {/* Hiển thị bản đồ */}
          {location && (
            <View style={styles.mapContainer}>
              <Text style={styles.mapTitle}>Current Location</Text>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Your Location"
                />
              </MapView>
            </View>
          )}

          {/* Nút Logout */}
          <View style={styles.logoutButtonContainer}>
            <Button title="Logout" onPress={handleLogout} color="#e74c3c" />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  mapContainer: {
    marginTop: 20,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  map: {
    flex: 1,
  },
  logoutButtonContainer: {
    marginTop: 20,
  },
});

export default LoginScreen;