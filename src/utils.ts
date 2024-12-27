import { Dispatch, SetStateAction } from 'react'

export const joinClasses = (...classes: (string | false | null | undefined)[]): string => classes.filter(Boolean).join(' ')

export const fatalError = (message: string, error?: Error) => {
  alert(`${message} ${error?.message}`)
  console.error(message, error)
}

export type StateSetter<S> = Dispatch<SetStateAction<S>>
