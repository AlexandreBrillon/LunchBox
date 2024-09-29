
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons'; // Importing icon library
import { Camera, CameraType, useCameraPermissions, CameraView } from 'expo-camera'; // Camera imports
import axios from 'axios';
import { format } from 'react-string-format';
import { TouchableWithoutFeedback } from 'react-native';
import Constants from 'expo-constants';
import { ScrollView } from 'react-native';

const api_key = 'ee005e4f5ba45324c68ca32635e02f32';
const id = '4a1c77c0';


axios.get(format("https://api.edamam.com/api/recipes/v2?type=public&app_id={0}&app_key={1}", id, api_key), {
}).then((response) => {
  console.log(response.data);
});



const PlaceholderImage = require('../assets/images/lunch.png');

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back'); // Use CameraType directly
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
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  

  return (
    <View style={styles.container}>
      {!showCamera ? (
        <>
          <View style={styles.imageContainer}>
            <Text style={styles.text}>What's in my lunchbox?</Text>
            <Image source={PlaceholderImage} style={styles.image} />
            <View>
              <KeyboardAvoidingView
                behavior={'position'}
                keyboardVerticalOffset={Constants.statusBarHeight}
                style={styles.searchBarAdjust}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={styles.searchBar}
                      keyboardType='default'
                      placeholder="Search for recipes..."
                      placeholderTextColor="#aaa"
                    />
                  </View>
                  
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View>
          </View>

          <TouchableOpacity onPress={toggleCameraVisibility} style={styles.cameraIconButton}>
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>

          <StatusBar style="auto" />
        </>
      ) : (
        <>
          {permission && permission.granted ? (
            <CameraView style={styles.camera} facing={facing}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                  <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
                <Button title="Close Camera" onPress={toggleCameraVisibility} />
              </View>
            </CameraView>
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
    marginTop: 20,
    marginBottom: 160,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchBarAdjust: {
    flex: 1,
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
    marginBottom: 20,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    padding: 10,
  },
});
