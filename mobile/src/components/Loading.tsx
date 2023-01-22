import { ActivityIndicator, View, StyleSheet } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 justify-center align-middle bg-background">
      <ActivityIndicator color="#7c3aed" />
    </View>
  )
}
