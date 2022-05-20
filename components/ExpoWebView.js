import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";

import { useExpoPushNotifications } from "../providers/notifications";

const ExpoWebView = () => {
  const { sendNotification } = useExpoPushNotifications();
  const [websiteURL, setWebsiteURL] = useState("https://expo.dev");
  const [inputText, setInputText] = useState("https://expo.dev");

  const handleTextChange = (text) => {
    setInputText(text);
  };
  const handleURLChange = () => {
    const isValidURL =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
        inputText
      );
    if (isValidURL) {
      setWebsiteURL(inputText);
    } else {
      sendNotification({
        title: "Invalid URL!",
        body: "Please enter a valid website address",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Try a website within app!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          dense
          placeholder="Enter website url"
          onChangeText={handleTextChange}
          value={inputText}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleURLChange}
          style={{ marginLeft: 10 }}
        >
          Display
        </Button>
      </View>
      <WebView style={styles.container} source={{ uri: websiteURL }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: { width: "70%" },
});

export default ExpoWebView;
