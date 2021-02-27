import { Ionicons } from "@expo/vector-icons"
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { Modal, StyleSheet, View, Text, Button, TouchableOpacity, FlatList } from "react-native"

import DateTimePicker, { Event } from '@react-native-community/datetimepicker'
import Picker, { Item } from "react-native-picker-select"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const Remainder = () => {
    const [remainders, setRemainders] = useState<AddRemainderFormData[]>([]);

    const refreshRemainder = async () => {
        let remainderPromise = await AsyncStorage.getItem('remainder');
        if (!remainderPromise) {
            remainderPromise = ''
        }
        let remainders = JSON.parse(remainderPromise) || [];
        setRemainders(remainders)
        console.log("remainder list from storage", remainders)
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
    minute = "minutes",
    hours = "hours",
    days = "days"
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
    label: 'minute',
    value: "minute",
    key: 'minute'
},
{
    label: 'hours',
    value: "hours",
    key: 'hours'
}]

type AddRemainderFormData = {
    key: string,
    repeat: repeat,
    frequency?: frequency,
    freqNumber?: number,
    time?: Date
}

type AddRemainderProps = {
    onSubmit: (submitForm: AddRemainderFormData) => {}
}

export const RemainderList = ({ remainders, refreshRemainder }: { remainders: AddRemainderFormData[], refreshRemainder: () => {} }) => {

    const onDelete = async (keyToDelete: string) => {
        let remainders: AddRemainderFormData[] = await getExistingRemainders()
        console.log('delete called on key', keyToDelete)
        remainders = remainders.filter((remainder) => remainder.key !== keyToDelete);
        AsyncStorage.setItem('remainder', JSON.stringify(remainders))
        refreshRemainder();
    }

    console.log('items to be rendered is', remainders)
    return (
        <FlatList data={remainders} renderItem={({ item }: { item: AddRemainderFormData }) =>
            <View>
                <TouchableOpacity onLongPress={() => onDelete(item.key)}>
                    {
                        item.repeat == repeat.EVERY ?
                            <View>
                                <Text>Duration: Every {item.freqNumber} {item.frequency}</Text>
                            </View> :
                            <View>
                                <Text>Repeat : {item.repeat}</Text>
                                <Text>Time : {item.time}</Text>
                            </View>
                    }
                </TouchableOpacity>
            </View>
        } />
    )
}

export const AddRemainder = ({ refreshRemainder }: { refreshRemainder: () => {} }) => {
    const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
    const setModalClose = useCallback(() => setAddModalOpen(!isAddModalOpen), [isAddModalOpen]);

    const submitRemainder = async (data: AddRemainderFormData) => {
        let remainders: AddRemainderFormData[] = await getExistingRemainders()
        remainders.push(data)
        console.log("data to be saved after add", remainders)
        AsyncStorage.setItem('remainder', JSON.stringify(remainders))
        setModalClose()
        refreshRemainder();
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
    return (
        <View >
            <Picker items={repeatationOptions} value={repatation} onValueChange={setRepeat} />
            {repatation == repeat.EVERY ? <View>
                <Picker items={frequencyOptions} value={frequencyValue} onValueChange={(value, index) => { setFreqNumber(1); setFrequency(value) }} />
                <Picker items={frequencyValue == frequency.minute ? minuteOptions : frequency.hours ? hoursOption : hoursOption}
                    value={freqNumber} onValueChange={(value, index) => setFreqNumber(value)} />
            </View> :
                <View>
                    <Text>{time.toLocaleTimeString()}</Text>
                    <DateTimePicker value={time} onChange={(event: any, date?: any): void => setTime(date || new Date())} mode="time" display="clock" />
                </View>
            }
            <TouchableOpacity style={styles.addBtn} onPress={() => {
                let formData: AddRemainderFormData = {
                    frequency: frequencyValue,
                    freqNumber: freqNumber,
                    repeat: repatation,
                    time,
                    key: new Date().getTime().toString()
                }
                props.onSubmit(formData)
            }} >
                <Text>Add Remainder</Text>
            </TouchableOpacity>
        </View>
    )
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
    closeBtn: {
        backgroundColor: 'red',
        color: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginStart: 10
    }
})

async function getExistingRemainders() {
    let remainderPromise = await AsyncStorage.getItem('remainder') || ''
    console.log('added remainder', remainderPromise)
    let remainders: AddRemainderFormData[] = []
    if (remainderPromise) {
        remainders = JSON.parse(remainderPromise)
    }
    return remainders
}
