import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraType, useCameraPermissions, CameraView } from 'expo-camera';
import axios from 'axios';
import { format } from 'react-string-format';
import * as MediaLibrary from 'expo-media-library';

const api_key = 'ee005e4f5ba45324c68ca32635e02f32';
const id = '4a1c77c0';

const lunchboxImage = require('../assets/images/lunch.png'); // Default lunchbox image

interface Recipe {
  label: string;
  image: string;
  uri: string;
}

interface RecipeResponse {
  hits: {
    recipe: Recipe;
  }[];
}

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false); // Controls visibility of the camera
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [recipes, setRecipes] = useState<{ recipe: Recipe }[]>([]); // State to hold the recipes
  const cameraRef = useRef<CameraView | null>(null); // Reference for the camera

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

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 0.5, // Quality of the image
        base64: true, // Get base64 string
        skipProcessing: false, // Skip processing
      };

      const photo = await cameraRef.current.takePictureAsync(options);

      if (photo && photo.uri) {
        console.log(photo.uri); // Log the photo URI, or handle it as needed
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          await MediaLibrary.createAssetAsync(photo.uri);
          alert('Meal saved to gallery!');
        } else {
          alert('Permission to access gallery is required!');
        }

        setShowCamera(false); // Hide the camera after taking the picture
      }
    }
  };

  // Function to fetch recipes based on the user's input
  const fetchRecipes = async () => {
    if (searchQuery.trim() === '') return; // Prevent fetching if the search query is empty

    try {
      const response = await axios.get<RecipeResponse>(
        format("https://api.edamam.com/api/recipes/v2?type=public&app_id={0}&app_key={1}&q={2}", id, api_key, searchQuery)
      );
      console.log("API Response:", response.data);
      setRecipes(response.data.hits); // Store hits directly
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          {!showCamera ? (
            <>
              <View style={styles.imageContainer}>
                <Text style={styles.text}>What's in your lunchbox today?</Text>
                <Image 
                  source={lunchboxImage} 
                  style={styles.image} 
                />
              </View>
              {/* Search Bar at the top */}
              <TextInput
                style={styles.searchBar}
                placeholder="Search for recipes..."
                placeholderTextColor="#aaa"
                value={searchQuery} // Set the current value of the input
                onChangeText={setSearchQuery} // Update the search query state
                onSubmitEditing={fetchRecipes} // Fetch recipes when user submits the search
              />
              {/* FlatList to display fetched recipes */}
              <FlatList
                data={recipes}
                keyExtractor={(item) => item.recipe.uri}
                renderItem={({ item }) => (
                  <View style={styles.recipeItem}>
                    <Image source={{ uri: item.recipe.image }} style={styles.recipeImage} />
                    <Text style={styles.recipeTitle}>{item.recipe.label}</Text>
                  </View>
                )}
                numColumns={3} // Display 3 items per row
                columnWrapperStyle={styles.row} // Custom style for the row
              />
              {/* we will conditionally render the camera button based on whether recipes are shown */}
              {recipes.length === 0 && ( //if there are no recipes, show the camera button
                <TouchableOpacity onPress={toggleCameraVisibility} style={styles.cameraIconButton}>
                  <MaterialIcons name="camera-alt" size={32} color="white" />
                </TouchableOpacity>
              )}
              <StatusBar style="auto" />
            </>
          ) : (
            <>
              {permission && permission.granted ? (
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                  <View style={styles.topRightButtonContainer}>
                    <Button title="Close Camera" onPress={toggleCameraVisibility} />
                  </View>
                  <View style={styles.bottomButtonsContainer}>
                    <TouchableOpacity style={styles.flipCameraButton} onPress={toggleCameraFacing}>
                      <Text>Flip Camera</Text>
                    </TouchableOpacity>
                    <Button title="Take Picture" onPress={takePicture} />
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
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    paddingTop: 20, // Adjust padding to move it up
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
    alignSelf: 'center',
  },
  text: {
    marginTop: 40,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchBar: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 5,
    width: '90%',
    marginTop: 300,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    alignSelf: 'center', // Center the search bar horizontally
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  topRightButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center', // Center children horizontally
  },
  flipCameraButton: {
    width: 120,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    padding: 5,
  },
  row: {
    flexDirection: 'row', // Display the items in a row
    justifyContent: 'space-between', // Space out the items evenly
    marginBottom: 10,
  },
  recipeItem: {
    width: screenWidth / 3 - 20, // 3 items per row, accounting for padding
    marginHorizontal: 5,
    marginBottom: 10,
    alignItems: 'center', // Center text and image in each item
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recipeTitle: {
    marginTop: 5,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
