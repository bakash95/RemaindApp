import { deleteRemainderInStorageForId } from "../remainder.storage";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Card, Colors, IconButton } from "react-native-paper";
import { AddRemainderFormData, repeat, frequency } from "../remainder.types";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { Button } from 'react-native-paper'

import { addRemainderStyles as styles } from '../addRemainders.styles'

import i18n from 'i18n-js'
import moment from 'moment'
import Swipeable from "react-native-gesture-handler/Swipeable";

export const RemainderList = ({ remainders, refreshRemainder }: { remainders: AddRemainderFormData[], refreshRemainder: () => {} }) => {
    let [loading, setLoading] = useState<boolean>(false);
    const onDelete = async (keyToDelete: string) => {
        setLoading(true)
        await deleteRemainderInStorageForId(keyToDelete)
        refreshRemainder();
        setLoading(false)
    }

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} animating={loading} size="large"></ActivityIndicator>
    }

    return (
        <FlatList data={remainders} renderItem={({ item }: { item: AddRemainderFormData }) =>
            <Swipeable renderRightActions={() => {
                return <IconButton style={btnStyles.deleteBtn}
                    color={Colors.red600}
                    icon="delete"
                    onPress={() => { onDelete(item.key) }} />
            }}>
                <Card key={item.key}>
                    <Card.Title subtitle={item.repeat == repeat.EVERY ?
                        i18n.t('remainder') : item.repeat == repeat.TIMER ? i18n.t('timer') :
                            i18n.t('alarm')}
                        title={item.title}></Card.Title>
                    <Card.Content style={styles.cardContainer}>
                        <Text>{item.description}</Text>
                        {
                            item.repeat == repeat.EVERY ?
                                <View>
                                    <Text>Duration: Every {item.frequency == frequency.hours ? item.freqNumber / (60 * 60) :
                                        item.frequency == frequency.minute ? item.freqNumber / 60 :
                                            item.frequency == frequency.days ? item.freqNumber / (60 * 60 * 24) : 0} {item.frequency}</Text>
                                </View> :
                                <View>
                                    <Text style={styles.cardContentStyle}>{i18n.t('repeat')} {item.repeat}</Text>
                                    <Text>{i18n.t('time')} {moment(item.time).format('llll')}</Text>
                                </View>
                        }
                    </Card.Content>
                </Card>
            </Swipeable>
        } />
    )
}

const btnStyles = StyleSheet.create({
    deleteBtn: {
        marginLeft: 10,
        alignSelf: 'center'
    }
})