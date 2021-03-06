import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import { View, Modal, Text, TouchableOpacity } from "react-native";
import { DatePicker, TimePicker, SelectField, TextInputComp } from "../../common";
import { addRemainderToStorage } from "../remainder.storage";
import { AddRemainderFormData, repeat, frequency, AddRemainderProps, repeatationOptions, frequencyOptions, minuteOptions, hoursOption } from "../remainder.types";

import i18n from 'i18n-js'
import moment from 'moment'

import { addRemainderStyles as styles } from '../addRemainders.styles';

export const AddRemainder = ({ refreshRemainder }: { refreshRemainder: () => {} }) => {
    const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
    const setModalClose = useCallback(() => setAddModalOpen(!isAddModalOpen), [isAddModalOpen]);

    const submitRemainder = async (data: AddRemainderFormData) => {
        await addRemainderToStorage(data)
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
    const [title, setTitle] = useState<string>(i18n.t('remainder'));
    const [description, setDescription] = useState<string>('');
    return (
        <View style={styles.addRemainderStyle}>
            <TextInputComp style={styles.padding} label={i18n.t('title')} value={title} onChangeText={setTitle}></TextInputComp>
            <TextInputComp style={styles.padding} label={i18n.t('description')} value={description} onChangeText={setDescription}></TextInputComp>
            <View style={styles.padding}>
                <View style={styles.paddingBtm}>
                    <SelectField items={repeatationOptions} value={repatation}
                        onValueChange={setRepeat} />
                </View>
                {
                    repatation == repeat.EVERY ?
                        <View>
                            <SelectField items={frequencyOptions} value={frequencyValue}
                                onValueChange={(value, index) => { setFreqNumber(1); setFrequency(value) }} />
                            <SelectField items={frequencyValue == frequency.minute ? minuteOptions : frequency.hours ? hoursOption : hoursOption}
                                value={freqNumber} onValueChange={(value, index) => setFreqNumber(value)} />
                            {
                                frequencyValue == frequency.days &&
                                <View style={[styles.customDateContainer]}>
                                    <Text style={[styles.centerText]}>{moment(time).format('llll')}</Text>
                                    <DatePicker value={time} setTime={setTime} />
                                    <TimePicker value={time} setTime={setTime} />
                                </View>
                            }
                        </View> :
                        repatation == repeat.ONE_TIME ?
                            <View style={[styles.customDateContainer]}>
                                <Text style={[styles.centerText]}>{moment(time).format('llll')}</Text>
                                <DatePicker value={time} setTime={setTime} />
                                <TimePicker value={time} setTime={setTime} />
                            </View> :
                            <View>
                                <SelectField items={minuteOptions}
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
                <Text>{i18n.t('addremainder')}</Text>
            </TouchableOpacity>
        </View>
    )
}