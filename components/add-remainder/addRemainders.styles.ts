import { StyleSheet } from "react-native";

export const addRemainderStyles = StyleSheet.create({
    addBtnContainer: {
        alignSelf: 'flex-end'
    },
    modalStyles: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column'
    },
    addBtn: {
        padding: 15
    },
    addRemainderBtn: {
        alignSelf: 'center',
        borderColor: 'green',
        borderWidth: 1,
        textAlign: 'center',
        padding: 15
    },
    paddingBtm: {
        paddingBottom: 10,
    },
    closeBtn: {
        backgroundColor: 'red',
        color: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        marginStart: 10
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    cardContentStyle: {
        paddingBottom: 10
    },
    addRemainderStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    customDateContainer: {
        paddingLeft: 10,
        textAlignVertical: 'center',
        flexDirection: 'row'
    },
    datePickerStyle: {
        paddingLeft: 10
    },
    centerText: {
        alignSelf: 'center'
    },
    padding: {
        marginVertical: 10,
        marginHorizontal: 30
    }
})