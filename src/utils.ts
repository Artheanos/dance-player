export const joinClasses = (...classes: (string | false | null | undefined)[]): string => classes.filter(Boolean).join(' ')
