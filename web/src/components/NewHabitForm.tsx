import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from "phosphor-react";
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const weekDaysList = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

export function NewHabitForm() {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  async function createNewHabit (e: FormEvent) {
    e.preventDefault()    

    if(!title || !weekDays.length) return

    try {
      await api.post('habits', {
        title,
        weekDays
      })
      setTitle('')
      setWeekDays([])

      // Todo - Add Toast from Radix on Success

    } catch (error) {
      console.error(error)

      // Todo - Add toast from Radix on Error
    }
  }

  function handleToggleWeekDays(weekDayIndex: number) {
    if(weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex])
    }
  }

  return (
    <form className="w-full flex flex-col mt-6" onSubmit={createNewHabit}>
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprometimento?
      </label>

      <input 
        type="text"
        id="title"
        placeholder="ex.: Exercícios, dormir bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 transition-all border-2 border-zinc-800 focus:border-violet-500 outline-none"
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3 outline-none group">
        {weekDaysList.map((weekDay, i) => (
          <Checkbox.Root 
            key={weekDay} 
            className="flex items-center gap-3 group focus:outline-none"
            checked={weekDays.includes(i)}
            onCheckedChange={() => handleToggleWeekDays(i)}
          >
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-all group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background"
          >
            <Checkbox.Indicator>
              <Check size={20} className="color-white" />
            </Checkbox.Indicator>
          </div>
          <span className="font-semibold text-xl text-white leading-tigh">{weekDay}</span>
        </Checkbox.Root>
        ))}     
      </div>

      <button 
        type="submit" 
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  )
}