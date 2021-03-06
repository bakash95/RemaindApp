import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeNotificationForDeletedRemainder, scheduleNotificationForRemainder } from "./notifications/remainder.notifications";
import { AddRemainderFormData } from "./remainder.types";

const REMAINDER_CONST = 'remainder'

export const getAndParseRemainderFromStorage = async () => {
    let remainders: AddRemainderFormData[] = []
    let remainderPromise = await AsyncStorage.getItem(REMAINDER_CONST) || ''
    if (remainderPromise) {
        remainders = JSON.parse(remainderPromise)
    }
    console.log('list',remainders)
    return remainders
}

export const deleteRemainderInStorageForId = async (keyToDelete: string) => {
    let remainders: AddRemainderFormData[] = await getAndParseRemainderFromStorage()
    remainders = remainders.filter((remainder) => remainder.key !== keyToDelete);
    AsyncStorage.setItem(REMAINDER_CONST, JSON.stringify(remainders))
    removeNotificationForDeletedRemainder(keyToDelete);
}

export const addRemainderToStorage = async (data: AddRemainderFormData) => {
    let remainders: AddRemainderFormData[] = await getAndParseRemainderFromStorage()
    remainders.push(data)
    AsyncStorage.setItem(REMAINDER_CONST, JSON.stringify(remainders))
    scheduleNotificationForRemainder(data)
}