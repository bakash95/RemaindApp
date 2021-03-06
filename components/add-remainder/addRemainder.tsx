import { Ionicons } from "@expo/vector-icons"
import React, { useCallback, useEffect, useState } from "react"
import { Modal, StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native"

import DateTimePicker from '@react-native-community/datetimepicker'
import Picker, { Item } from "react-native-picker-select"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { Card, TextInput } from 'react-native-paper'

import * as Notifications from 'expo-notifications'
import { DateTriggerInput, NotificationRequestInput, TimeIntervalTriggerInput } from "expo-notifications"

const REMAINDER_CONST = 'remainder'

export const Remainder = () => {
    const [remainders, setRemainders] = useState<AddRemainderFormData[]>([]);

    const refreshRemainder = async () => {
        let remainderPromise = await AsyncStorage.getItem(REMAINDER_CONST);
        if (!remainderPromise) {
            remainderPromise = ''
        }
        let remainders = JSON.parse(remainderPromise) || [];
        setRemainders(remainders)
    }

    useEffect(() => {
        refreshRemainder()
    }, [])

    return (
        <View style={styles.container}>
            <RemainderList refreshRemainder={refreshRemainder} remainders={remainders} />
            <AddRemainder refreshRemainder={refreshRemainder} />
        </View>
    )
}

enum repeat {
    ONE_TIME = "ONE_TIME",
    EVERY = "EVERY"
}

enum frequency {
    minute = "minute",
    hours = "hour",
    days = "day"
}

const repeatationOptions: Item[] = [{
    label: 'one time',
    value: repeat.ONE_TIME,
    key: repeat.ONE_TIME
},
{
    label: 'every',
    value: repeat.EVERY,
    key: repeat.EVERY
},
]

const minuteOptions: Item[] = []
for (let i = 1; i < 60; i++) {
    minuteOptions.push({
        label: `${i}`,
        value: i,
        key: i
    })
}

const hoursOption: Item[] = []
for (let i = 1; i < 24; i++) {
    hoursOption.push({
        label: `${i}`,
        value: i,
        key: i
    })
}

const frequencyOptions: Item[] = [{
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

type AddRemainderFormData = {
    key: string,
    description?: string,
    title: string,
    repeat: repeat,
    frequency?: frequency,
    freqNumber: number,
    time: Date
}

type AddRemainderProps = {
    onSubmit: (submitForm: AddRemainderFormData) => {}
}

export const RemainderList = ({ remainders, refreshRemainder }: { remainders: AddRemainderFormData[], refreshRemainder: () => {} }) => {
    const onDelete = async (keyToDelete: string) => {
        let remainders: AddRemainderFormData[] = await getExistingRemainders()
        remainders = remainders.filter((remainder) => remainder.key !== keyToDelete);
        AsyncStorage.setItem(REMAINDER_CONST, JSON.stringify(remainders))
        Notifications.cancelScheduledNotificationAsync(keyToDelete)
        refreshRemainder();
    }

    return (
        <FlatList data={remainders} renderItem={({ item }: { item: AddRemainderFormData }) =>
            <TouchableOpacity onLongPress={() => onDelete(item.key)}>
                <Card key={item.key}>
                    <Card.Title subtitle={item.repeat == repeat.EVERY ? "Remainder" : "Alarm"}
                        title={item.title}></Card.Title>
                    <Card.Content style={styles.cardContainer}>
                        <Text style={styles.cardContentStyle}>{item.description}</Text>
                        {
                            item.repeat == repeat.EVERY ?
                                <View>
                                    <Text>Duration: Every {item.frequency == frequency.hours ? item.freqNumber / (60 * 60) :
                                        item.frequency == frequency.minute ? item.freqNumber / 60 :
                                            item.frequency == frequency.days ? item.freqNumber / (60 * 60 * 24) : 0} {item.frequency}</Text>
                                </View> :
                                <View>
                                    <Text>Repeat : {item.repeat}</Text>
                                    <Text>Time : {item.time}</Text>
                                </View>
                        }
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        } />
    )
}

export const AddRemainder = ({ refreshRemainder }: { refreshRemainder: () => {} }) => {
    const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
    const setModalClose = useCallback(() => setAddModalOpen(!isAddModalOpen), [isAddModalOpen]);

    const submitRemainder = async (data: AddRemainderFormData) => {
        let remainders: AddRemainderFormData[] = await getExistingRemainders()
        remainders.push(data)
        AsyncStorage.setItem(REMAINDER_CONST, JSON.stringify(remainders))
        setModalClose()
        refreshRemainder();
        let notificationRepeatTrigger: TimeIntervalTriggerInput = {
            repeats: data.repeat == repeat.EVERY,
            seconds: data.freqNumber
        }

        let notificationDateTrigger: DateTriggerInput = {
            date: data.time
        }

        let notification: NotificationRequestInput = {
            identifier: data.key,
            content: {
                body: data.description,
                title: data.title
            },
            trigger: data.repeat == repeat.EVERY ? notificationRepeatTrigger : notificationDateTrigger
        }

        Notifications.scheduleNotificationAsync(notification)
    }

    return (
        <View style={styles.addBtnContainer} >
            <Modal animationType="fade"
                style={styles.modalStyles}
                visible={isAddModalOpen}
                onRequestClose={setModalClose}>
                <Ionicons style={styles.addBtn} name="close" size={24} onPress={setModalClose} color="black" />
                <RemainderComp onSubmit={submitRemainder} />
            </Modal>
            <Ionicons style={styles.addBtn} name="add-circle-outline" size={60} onPress={setModalClose} color="green" />
        </View>
    )
}

const RemainderComp = (props: AddRemainderProps) => {
    const [repatation, setRepeat] = useState<repeat>(repeat.EVERY);
    const [frequencyValue, setFrequency] = useState<frequency>(frequency.hours);
    const [freqNumber, setFreqNumber] = useState<number>(1);
    const [time, setTime] = useState<Date>(new Date());
    const [title, setTitle] = useState<string>('remainder');
    const [description, setDescription] = useState<string>('');
    return (
        <View style={styles.addRemainderStyle}>
            <TextInput style={styles.padding} label="title" value={title} onChangeText={setTitle}></TextInput>
            <TextInput style={styles.padding} label="description" value={description} onChangeText={setDescription}></TextInput>
            <View style={styles.padding}>
                <View style={styles.paddingBtm}>
                    <Picker items={repeatationOptions} value={repatation} onValueChange={setRepeat} />
                </View>
                {
                    repatation == repeat.EVERY ?
                        <View>
                            <Picker items={frequencyOptions} value={frequencyValue} onValueChange={(value, index) => { setFreqNumber(1); setFrequency(value) }} />
                            <Picker items={frequencyValue == frequency.minute ? minuteOptions : frequency.hours ? hoursOption : hoursOption}
                                value={freqNumber} onValueChange={(value, index) => setFreqNumber(value)} />
                        </View> :
                        <View style={styles.customDateContainer}>
                            <Text style={[styles.datePickerStyle]}>{time.toLocaleString()}</Text>
                            <View style={[styles.datePickerStyle, styles.customDateContainer]}>
                                <DatePicker value={time} setTime={setTime} />
                                <TimePicker value={time} setTime={setTime} />
                            </View>
                        </View>
                }
            </View>
            <TouchableOpacity style={[styles.addRemainderBtn, styles.padding]} onPress={() => {
                let currDate = time;
                let freqNumberSeconds = 0
                if (repatation == repeat.EVERY) {
                    freqNumberSeconds = frequencyValue == frequency.minute ? freqNumber * 60 :
                        frequencyValue == frequency.hours ?
                            freqNumber * 60 * 60 : freqNumber * 60 * 60 * 24
                }
                let formData: AddRemainderFormData = {
                    title,
                    description,
                    frequency: frequencyValue,
                    freqNumber: freqNumberSeconds,
                    repeat: repatation,
                    time: currDate,
                    key: currDate.getTime().toString()
                }
                props.onSubmit(formData)
            }} >
                <Text>Add Remainder</Text>
            </TouchableOpacity>
        </View>
    )
}

const DatePicker = ({ value, setTime }: { value: Date, setTime: (date: Date) => void }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return isOpen ? <DateTimePicker
        value={value}
        onChange={(event: any, date?: any): void => { setOpen(false); setTime(date || new Date()) }}
        onTouchCancel={() => setOpen(false)}
        mode="datetime" />
        : <Ionicons style={styles.addBtn} name="calendar"
            size={24} onPress={() => setOpen(!isOpen)} color="green" />
}

const TimePicker = ({ value, setTime }: { value: Date, setTime: (date: Date) => void }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return isOpen ? <DateTimePicker
        value={value}
        onChange={(event: any, date?: any): void => { setOpen(false); setTime(date || new Date()) }}
        onTouchCancel={() => setOpen(false)}
        mode="time" />
        : <Ionicons style={styles.addBtn} name="time"
            size={24} onPress={() => setOpen(!isOpen)} color="green" />
}

const styles = StyleSheet.create({
    addBtnContainer: {
        alignSelf: 'flex-end'
    },
    modalStyles: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column'
    },
    addBtn: {
        padding: 15
    },
    addRemainderBtn: {
        alignSelf: 'center',
        borderColor: 'green',
        borderWidth: 1,
        textAlign: 'center',
        padding: 15
    },
    paddingBtm: {
        paddingBottom: 10,
    },
    closeBtn: {
        backgroundColor: 'red',
        color: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        marginStart: 10
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    cardContentStyle: {
        paddingBottom: 10
    },
    addRemainderStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    customDateContainer: {
        textAlignVertical: 'center',
        flexDirection: 'row'
    },
    datePickerStyle: {
        paddingLeft: 10
    },
    padding: {
        marginVertical: 10,
        marginHorizontal: 30
    }
})

async function getExistingRemainders() {
    let remainderPromise = await AsyncStorage.getItem(REMAINDER_CONST) || ''
    let remainders: AddRemainderFormData[] = []
    if (remainderPromise) {
        remainders = JSON.parse(remainderPromise)
    }
    return remainders
}
