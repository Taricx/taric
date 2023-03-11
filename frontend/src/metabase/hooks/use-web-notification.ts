import { useCallback } from "react";

const hasNotificationAPI = "Notification" in window;

export function useWebNotification() {
  const requestPermission = useCallback(async () => {
    if (!hasNotificationAPI) {
      return "denied";
    }
    return await Notification.requestPermission();
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (!hasNotificationAPI) {
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: "app/assets/img/favicon.png",
    });

    const closeNotification = (e: Event) => {
      e.preventDefault();
      notification.close();
    };

    notification.addEventListener("click", e => {
      e.preventDefault();
      window.focus();
    });

    window.addEventListener("beforeunload", closeNotification);

    document.addEventListener(
      "visibilitychange",
      e => {
        closeNotification(e);
        window.removeEventListener("beforeunload", closeNotification);
      },
      { once: true },
    );
  }, []);

  return [requestPermission, showNotification];
}
