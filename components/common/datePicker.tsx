import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker'
import { IconButton } from "react-native-paper";

export const DatePicker = ({ value, setTime }: { value: Date, setTime: (date: Date) => void }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return isOpen ? <DateTimePicker
        value={value}
        onChange={(event: any, date?: any): void => { setOpen(false); setTime(date || new Date()) }}
        onTouchCancel={() => setOpen(false)}
        mode="datetime" />
        : <IconButton size={30}
            icon="calendar"
            onPress={() => setOpen(!isOpen)} color="green" />
}