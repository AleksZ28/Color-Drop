import * as haptics from "expo-haptics";

export const triggerHapticWarning = () => {
  haptics.notificationAsync(
    haptics.NotificationFeedbackType.Warning
  );
};

export const triggerHapticSuccess = () => {
  haptics.impactAsync(
    haptics.ImpactFeedbackStyle.Light
  )
}
