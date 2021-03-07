import Picker from "react-native-picker-select"
import { PickerSelectProps } from 'react-native-picker-select'
import React from "react";
import { IconButton } from "react-native-paper";

export const SelectField = (props: PickerSelectProps) => {
    return <Picker
        Icon={() => <IconButton icon="chevron-down" color="green"></IconButton>}
        {...props} />
}