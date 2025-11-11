import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeHighScore = async (value: number) => {
  try {
    await AsyncStorage.setItem('highScore', value.toString());
  } catch (e) {
    console.error(e);
  }
}

export const getHighScore = async () => {
  try {
    const value = await AsyncStorage.getItem('highScore');
    return Number(value) || 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}