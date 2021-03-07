import moment from "moment"

const DEFAULT_FORMAT: any = 'llll'

export const getFormattedDateTime = (date: Date, format = DEFAULT_FORMAT) => {
    return moment(date).format(format)
}