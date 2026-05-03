export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register("/sw.js");
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  return Notification.requestPermission();
};

export const sendLocalNotification = async (title: string, body: string) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const registration = await navigator.serviceWorker?.ready;

  if (registration) {
    registration.showNotification(title, {
      body,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "healthcare-pro",
    });
    return;
  }

  new Notification(title, { body, icon: "/favicon.svg" });
};
