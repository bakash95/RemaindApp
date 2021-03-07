import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker'
import { IconButton } from "react-native-paper";

export const TimePicker = ({ value, setTime }: { value: Date, setTime: (date: Date) => void }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return isOpen ? <DateTimePicker
        value={value}
        onChange={(event: any, date?: any): void => { setOpen(false); setTime(date || new Date()) }}
        onTouchCancel={() => setOpen(false)}
        mode="time" />
        : <IconButton
            icon="clock"
            size={30} onPress={() => setOpen(!isOpen)} color="green" />
}