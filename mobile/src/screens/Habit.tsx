import { useState, useCallback } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { api } from "../lib/axios";
import clsx from "clsx";
import dayjs from "dayjs";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";

interface Params {
  date: string
}

interface HabitDetails {
  completed: string[],
  possibleHabits: {
    id: string;    
    title: string;
  }[]
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  
  const [habitDetails, setHabitDetails] = useState<HabitDetails | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute()
  const { date } = route.params as Params


  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')
  const isPastDate = parsedDate.endOf('day').isBefore(new Date())

  async function getHabits() {
    try {
      setLoading(true)
      const response = await api.get('day', { params: { date } })
      setHabitDetails(response.data)      
      setCompletedHabits(response.data.completedHabits)
    } catch (error) {
      console.error(error)
      Alert.alert('Ops...', 'Não foi possível carregar as informações dos hábitos')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`habits/${habitId}/toggle`)

      if(completedHabits?.includes(habitId)) {
        setCompletedHabits(prevState => prevState?.filter(habit => habit !== habitId))
      } else {
        setCompletedHabits(prevState => [...prevState, habitId])
      }
      
    } catch (error) {
      Alert.alert('Ops...', 'Não foi possível completar este hábito. Tente novamente em 5s.')
    }
  }

  const completedPercentage = habitDetails?.possibleHabits.length 
    ? (completedHabits?.length / habitDetails.possibleHabits.length) * 100
    : 0

  useFocusEffect(useCallback(() => {
    getHabits()
  }, []))

  if(loading) return <Loading />

  return (
    <View className='flex-1 bg-background px-8 pt-16'>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
      
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">{dayOfWeek}</Text>
        <Text className="text-white font-extrabold text-3xl lowercase">{dayAndMonth}</Text>
        
        <ProgressBar progress={completedPercentage} />

        <View className={clsx("mt-6", {
          ["opacity-50"]: isPastDate
        })}>
          {!habitDetails?.possibleHabits.length ? <HabitsEmpty /> : (
            <>
              {habitDetails?.possibleHabits.map(habit => (
                <Checkbox 
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits?.includes(habit.id)} 
                  onPress={() => handleToggleHabit(habit.id)}
                  disabled={isPastDate}
                />
              ))}
              {isPastDate && (
                <Text className="text-white mt-10 text-center">
                  Você não pode completar hábitos de uma data passsada.
                </Text>
              )}
            </>
          )
        }
        </View>

      </ScrollView>

    </View>
  )
}