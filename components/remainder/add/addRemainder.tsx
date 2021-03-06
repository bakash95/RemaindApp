import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import { View, Modal, Text, TouchableOpacity } from "react-native";
import { TextInput } from 'react-native-paper'
import { DatePicker } from "../../common/datePicker";
import { TimePicker } from "../../common/timePicker";
import { addRemainderToStorage } from "../remainder.storage";
import { AddRemainderFormData, repeat, frequency, AddRemainderProps, repeatationOptions, frequencyOptions, minuteOptions, hoursOption } from "../remainder.types";
import Picker from "react-native-picker-select"

import { addRemainderStyles as styles } from '../addRemainders.styles';

export const AddRemainder = ({ refreshRemainder }: { refreshRemainder: () => {} }) => {
    const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
    const setModalClose = useCallback(() => setAddModalOpen(!isAddModalOpen), [isAddModalOpen]);

    const submitRemainder = async (data: AddRemainderFormData) => {
        addRemainderToStorage(data)
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