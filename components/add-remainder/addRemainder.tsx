import { Ionicons } from "@expo/vector-icons"
import React, { useCallback, useEffect, useState } from "react"
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native"

import Picker from "react-native-picker-select"

import { addRemainderStyles as styles } from './addRemainders.styles';

import { Card, TextInput } from 'react-native-paper'

import * as Notifications from 'expo-notifications'
import { DailyTriggerInput, DateTriggerInput, NotificationRequestInput, TimeIntervalTriggerInput } from "expo-notifications"
import { AddRemainderFormData, repeat, frequency, AddRemainderProps, repeatationOptions, frequencyOptions, minuteOptions, hoursOption } from "./remainder.types"
import { DatePicker } from "../common/datePicker"
import { TimePicker } from "../common/timePicker"
import { deleteRemainderInStorageForId, getAndParseRemainderFromStorage, addRemainderToStorage } from "./remainder.storage"

export const Remainder = () => {
    const [remainders, setRemainders] = useState<AddRemainderFormData[]>([]);

    const refreshRemainder = async () => {
        let remainders = await getAndParseRemainderFromStorage()
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

export const RemainderList = ({ remainders, refreshRemainder }: { remainders: AddRemainderFormData[], refreshRemainder: () => {} }) => {
    const onDelete = async (keyToDelete: string) => {
        deleteRemainderInStorageForId(keyToDelete)
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
        addRemainderToStorage(data)
        setModalClose()
        refreshRemainder();
        let notificationRepeatTrigger: TimeIntervalTriggerInput = {
            repeats: data.repeat == repeat.EVERY,
            seconds: data.freqNumber
        }

        let dailyTrigger: DailyTriggerInput = {
            repeats: true,
            hour: data.time.getHours(),
            minute: data.time.getMinutes()
        }

        let notificationDateTrigger: DateTriggerInput = {
            date: data.time
        }

        let notification: NotificationRequestInput = {
            identifier: data.key,
            content: {
                body: data.description,
                title: data.title,
                sound: true,
                vibrate: [0, 250, 250, 250]
            },
            trigger: data.repeat == repeat.EVERY ?
                data.frequency == frequency.days ? dailyTrigger :
                    notificationRepeatTrigger : notificationDateTrigger
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
                            {
                                frequencyValue == frequency.days &&
                                <View style={[styles.customDateContainer]}>
                                    <Text style={[styles.centerText]}>{time.toLocaleString()}</Text>
                                    <DatePicker value={time} setTime={setTime} />
                                    <TimePicker value={time} setTime={setTime} />
                                </View>
                            }
                        </View> :
                        repatation == repeat.ONE_TIME ?
                            <View style={[styles.customDateContainer]}>
                                <Text style={[styles.centerText]}>{time.toLocaleString()}</Text>
                                <DatePicker value={time} setTime={setTime} />
                                <TimePicker value={time} setTime={setTime} />
                            </View> :
                            <View>
                                <Picker items={minuteOptions}
                                    value={freqNumber} onValueChange={(value, index) => setFreqNumber(value)} />
                            </View>
                }
            </View>
            <TouchableOpacity style={[styles.addRemainderBtn, styles.padding]} onPress={() => {
                let currDate = time;
                let freqNumberSeconds = 0
                if (repatation == repeat.EVERY) {
                    freqNumberSeconds = frequencyValue == frequency.minute ? freqNumber * 60 :
                        frequencyValue == frequency.hours ?
                            freqNumber * 60 * 60 : 0
                } else if (repatation == repeat.TIMER) {
                    currDate.setMinutes(currDate.getMinutes() + freqNumber);
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