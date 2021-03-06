import { Item } from "react-native-picker-select"

export enum repeat {
    ONE_TIME = "ONE_TIME",
    EVERY = "EVERY",
    TIMER = "TIMER"
}

export enum frequency {
    minute = "minute",
    hours = "hour",
    days = "day"
}

export const repeatationOptions: Item[] = [{
    label: 'one time',
    value: repeat.ONE_TIME,
    key: repeat.ONE_TIME
},
{
    label: 'every',
    value: repeat.EVERY,
    key: repeat.EVERY
},
{
    label: 'timer',
    value: repeat.TIMER,
    key: repeat.TIMER
}
]

export const minuteOptions: Item[] = []
for (let i = 1; i < 60; i++) {
    minuteOptions.push({
        label: `${i}`,
        value: i,
        key: i
    })
}

export const hoursOption: Item[] = []
for (let i = 1; i < 24; i++) {
    hoursOption.push({
        label: `${i}`,
        value: i,
        key: i
    })
}

export const frequencyOptions: Item[] = [{
    label: frequency.minute,
    value: frequency.minute,
    key: frequency.minute
},
{
    label: frequency.hours,
    value: frequency.hours,
    key: frequency.hours
},
{
    label: frequency.days,
    value: frequency.days,
    key: frequency.days
}]

export type AddRemainderFormData = {
    key: string,
    description?: string,
    title: string,
    repeat: repeat,
    frequency?: frequency,
    freqNumber: number,
    time: Date
}

export type AddRemainderProps = {
    onSubmit: (submitForm: AddRemainderFormData) => {}
}
