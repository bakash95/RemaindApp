import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from "@expo/vector-icons"

export const TimePicker = ({ value, setTime }: { value: Date, setTime: (date: Date) => void }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    return isOpen ? <DateTimePicker
        value={value}
        onChange={(event: any, date?: any): void => { setOpen(false); setTime(date || new Date()) }}
        onTouchCancel={() => setOpen(false)}
        mode="time" />
        : <Ionicons style={{ padding: 15 }} name="time"
            size={24} onPress={() => setOpen(!isOpen)} color="green" />
}