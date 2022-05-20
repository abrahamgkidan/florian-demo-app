import * as React from "react";

import { ExpoPushNotificationsProvider } from "./providers/notifications";
import ExpoWebView from "./components/ExpoWebView";

export default function App() {
  return (
    <ExpoPushNotificationsProvider>
      <ExpoWebView />
    </ExpoPushNotificationsProvider>
  );
}
