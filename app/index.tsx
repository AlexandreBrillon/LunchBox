import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { Camera, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons'; // Importing icon library

const PlaceholderImage = require('../assets/images/lunch.png');

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false); // State to toggle camera visibility

  useEffect(() => {
    const askForPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    };

    if (!permission) {
      askForPermissions();
    }
  }, [permission]);

  const toggleCameraVisibility = () => {
    setShowCamera(prev => !prev);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  return (
    <View style={styles.container}>
      {!showCamera ? ( // Show main content or camera based on state
        <>
          <View style={styles.imageContainer}>
            <Text style={styles.text}>What's in my lunchbox?</Text>
            <Image source={PlaceholderImage} style={styles.image} />
          </View>
          {/* Replace Open Camera button with camera icon */}
          <TouchableOpacity onPress={toggleCameraVisibility} style={styles.cameraIconButton}>
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for recipes..."
            placeholderTextColor="#aaa" 
          />
          <StatusBar style="auto" />
        </>
      ) : (
        <>
          {permission && permission.granted ? (
            <Camera style={styles.camera} type={facing}>
              <View style={styles.buttonContainer}>
                <Button title="Flip Camera" onPress={toggleCameraFacing} />
                <Button title="Close Camera" onPress={toggleCameraVisibility} />
              </View>
            </Camera>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.message}>We need your permission to show the camera</Text>
              <Button onPress={requestPermission} title="Grant Permission" />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#800080',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 70,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  text: {
    marginTop: 40,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBar: {
    height: 70,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
    marginTop: 20, // Space above the search bar
    marginBottom: 160, // Space from the bottom
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 30,
    color: 'white',
  },
  cameraIconButton: {
    marginBottom: 20, // Space between icon and search bar
  },
});
