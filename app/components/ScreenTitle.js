import React from 'react';
import { Text, View } from 'react-native';
import Colors from '../constants/Colors';

export default function ScreenTitle({ title = "Screen" }) {
    return (
        <View style={{ width: '100%', alignItems: 'center', borderBottomColor:Colors.PRIMARY_DARKER , borderBottomWidth:3, marginBottom:10 }}>
            <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 30  }}>{title}</Text>
        </View>
    )
}