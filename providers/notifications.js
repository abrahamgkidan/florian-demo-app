import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Excerpted from Expo
export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(`Expo push token: ${token}`);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

// Exerpted from Expo
export async function sendPushNotification(expoPushToken, message = {}) {
  const pushMessage = {
    to: expoPushToken,
    sound: "default",
    title: "Demo app",
    body: "Expo app developed for Florian by freelancer: Abraham Gebrekidan!",
    ...message,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pushMessage),
  });
}

const ExpoPushNotificationsContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const ExpoPushNotificationsProvider = ({ children, options }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationResponse, setNotificationResponse] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Note: An alternative method of responding to user action on notifications
  // const lastNotificationResponse = Notifications.useLastNotificationResponse();
  // useEffect(() => {
  //   if (lastNotificationResponse) {
  //     setNotificationResponse(lastNotificationResponse.notification.request.content.data.url);
  //   }
  // }, [lastNotificationResponse]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification: ", notification);
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response: ", response);
        console.log(response.notification.request.content.data.url);
        setNotificationResponse(response.notification.request.content.data.url);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const sendNotification = async (message) => {
    await sendPushNotification(expoPushToken, message);
  };

  return (
    <ExpoPushNotificationsContext.Provider
      value={{
        expoPushToken,
        notification,
        notificationResponse,
        sendNotification,
      }}
    >
      {children}
    </ExpoPushNotificationsContext.Provider>
  );
};

export const useExpoPushNotifications = () => {
  return useContext(ExpoPushNotificationsContext);
};
