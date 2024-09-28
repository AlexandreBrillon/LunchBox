import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const baseUrl = 'https://api.edamam.com';

// axios.get('https://api.edamam.com/api/recipes/v2?type=public&q=beef%2C%20broccoli%2C%20ginger%2C%20onion&app_id=4a1c77c0&app_key=ee005e4f5ba45324c68ca32635e02f32')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error("Error fetching data: ", error);
//   });

  axios({
    method: 'get',
    url: `${baseUrl}/api/recipes/v2`,
  }).then((response) => {
    console.log(response.data);
  });

axios.get(`${baseUrl}/api/recipes/v2`, {
     
  }).then((response) => {
    console.log(response.data);
  });

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>What's In Your Lunchbox?</Text>

    </View>

  );
}

const styles = StyleSheet.create({

});
