import * as Checkbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabitsListProps {
  date: Date
}

interface HabitsInfoProps {
  possibleHabits: PossibleHabits[]
  completedHabits: string[]
}

interface PossibleHabits {
  id: string
  title: string
}

export function HabitsList({ date }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfoProps | null>(null)

  const isPastDate = dayjs(date).endOf('day').isBefore(new Date(), 'day')

  async function getHabitsInfo() {
    try {
      const response = await api.get('day', {
        params: {
          date: date.toISOString()
        }
      })  
      setHabitsInfo(response.data)      
    } catch (error) {
      console.error(error)
    }
  }

  async function toggleCheckHabit(habitId: string) {
    try {
      const isHabitAlreadyCompleted = habitsInfo?.completedHabits.includes(habitId)

      if(isHabitAlreadyCompleted) {        
        setHabitsInfo(prevState => ({
          ...prevState!,
          completedHabits: [...prevState!.completedHabits.filter(id => id !== habitId)]
        }))

      } else {
        setHabitsInfo(prevState => ({
          ...prevState!,
          completedHabits: [...prevState!.completedHabits, habitId]
        }))
      }
      await api.patch(`habits/${habitId}/toggle`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getHabitsInfo()
  }, [date])

  if(!habitsInfo) {
    return <div />
  }

  return (
    <div className={clsx("mt-6 flex flex-col gap-3", {
      ["opacity-50"]: isPastDate
    })}>
        {habitsInfo?.possibleHabits.length ? (
          habitsInfo.possibleHabits.map(habit => {
            const isCompleted = habitsInfo.completedHabits?.includes(habit.id)
            
            return (
              <Checkbox.Root
                key={habit.id} 
                className="flex items-center gap-3 group"
                checked={isCompleted}
                onCheckedChange={() => toggleCheckHabit(habit.id)}
                disabled={isPastDate}
              >              
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
                  <Checkbox.Indicator>
                    <Check size={20} className="color-white" />
                  </Checkbox.Indicator>
                </div>
                <span 
                  className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"
                >
                  {habit.title}
                </span>
              </Checkbox.Root>
            )
          })            
        ) : (
        <span className="font-medium text-base text-zinc-400 leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
          Você não possui nenhum hábito neste dia.
        </span>
      )}
    </div>
  )
}