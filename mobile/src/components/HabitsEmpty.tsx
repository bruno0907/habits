import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export function HabitsEmpty() {
  const { navigate } = useNavigation()

  return (
    <View className="flex-1 w-full justify-center pt-16 gap-3">
      <Text className="text-zinc-400 text-base text-center">
        Você não possui nenhum hábito monitorado.
      </Text>

      <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('new')}>
        <Text className="text-violet-400 text-base text-center underline">
          Comece hoje aqui!
        </Text>
      </TouchableOpacity>
    </View>
  )
}