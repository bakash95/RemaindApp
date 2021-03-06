import i18n from 'i18n-js'
import en from './en.translations'
import { locale } from 'expo-localization'
import moment from 'moment'

export const initTranslations = () => {
    i18n.fallbacks = true
    i18n.locale = locale
    moment.locale(locale)
    i18n.translations = {
        en
    }
}