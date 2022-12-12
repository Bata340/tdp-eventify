import React from 'react';
import { Image, View } from 'react-native';

export default function UserAvatar({
    uri = "",
    size = 30
}) {
    return(
        <View style={{ borderRadius: size * 2, width: size, height: size, overflow: 'hidden', alignItems: 'center' }}>
            <Image
                style={{ height: size, width: size }}
                source={{ uri: uri }}
            />
        </View>
    )
}