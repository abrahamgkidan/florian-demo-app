import React from "react";
import { Text, View } from "react-native";

const NotificationLog = ({
  expoPushToken,
  notification,
  sendNotification,
}) => {
  return (
    <View>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
    </View>
  );
};

export default NotificationLog;
