import React, { useEffect, useState } from "react"
import { View } from "react-native"

import { addRemainderStyles as styles } from './addRemainders.styles';

import { AddRemainderFormData } from "./remainder.types"
import { getAndParseRemainderFromStorage } from "./remainder.storage"
import { RemainderList } from "./list/listRemainders";
import { AddRemainder } from './add/addRemainder'

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