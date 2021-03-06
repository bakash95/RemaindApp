import { deleteRemainderInStorageForId } from "../remainder.storage";
import React from "react";
import { Card } from "react-native-paper";
import { AddRemainderFormData, repeat, frequency } from "../remainder.types";
import { FlatList, TouchableOpacity, View, Text } from "react-native";

import { addRemainderStyles as styles } from '../addRemainders.styles'

import i18n from 'i18n-js'
import moment from 'moment'

export const RemainderList = ({ remainders, refreshRemainder }: { remainders: AddRemainderFormData[], refreshRemainder: () => {} }) => {
    const onDelete = async (keyToDelete: string) => {
        deleteRemainderInStorageForId(keyToDelete)
        refreshRemainder();
    }

    return (
        <FlatList data={remainders} renderItem={({ item }: { item: AddRemainderFormData }) =>
            <TouchableOpacity onLongPress={() => onDelete(item.key)}>
                <Card key={item.key}>
                    <Card.Title subtitle={item.repeat == repeat.EVERY ? i18n.t('remainder') : i18n.t('alarm')}
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
            </TouchableOpacity>
        } />
    )
}