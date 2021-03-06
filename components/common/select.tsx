import Picker from "react-native-picker-select"
import { PickerSelectProps } from 'react-native-picker-select'
import React from "react";

export const SelectField = (props: PickerSelectProps) => {
    return <Picker {...props} />
}