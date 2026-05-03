import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../firebase";

export const initFCM = async () => {
  const messaging = await getFirebaseMessaging();
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  if (!messaging || !vapidKey || !("Notification" in window)) {
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const token = await getToken(messaging, {
    vapidKey,
  });

  console.log("FCM TOKEN:", token);
};

export const listenFCM = async () => {
  const messaging = await getFirebaseMessaging();

  if (!messaging || !("Notification" in window)) {
    return;
  }

  onMessage(messaging, (payload) => {
    new Notification(payload.notification?.title || "Notification", {
      body: payload.notification?.body,
    });
  });
};
