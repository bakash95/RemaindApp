import * as Notifications from 'expo-notifications'
import { TimeIntervalTriggerInput, DailyTriggerInput, DateTriggerInput, NotificationRequestInput } from 'expo-notifications'
import { AddRemainderFormData, frequency, repeat } from '../remainder.types'

export const removeNotificationForDeletedRemainder = (keyToDelete: string) => {
    Notifications.cancelScheduledNotificationAsync(keyToDelete)
}

export const scheduleNotificationForRemainder = (data: AddRemainderFormData) => {
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