import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function EventifyTextInput({
    name = "",
    placeholderTextColor = Colors.GRAY,
    inputTextColor = Colors.GRAY,
    fontSize = 17,
    backgroundColor = 'transparent',
    leftIcon = null,
    rightIcon = null,
    isPassword = false,
    ...props
}) {
    const [secureEntry, setSecureEntry] = useState(isPassword);

    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 }}>
            {leftIcon &&
                <View style={{ justifyContent: 'center', position: 'absolute', left: 15, alignContent: 'center' }}>
                    {leftIcon}
                </View>
            }
            <TextInput secureTextEntry={secureEntry} style={{ color: inputTextColor, fontSize: fontSize, backgroundColor: backgroundColor, padding: 15, paddingLeft: leftIcon != null ? 50 : 0, width: '100%' }} placeholderTextColor={placeholderTextColor} placeholder={name} {...props} />
            {isPassword &&
                <TouchableOpacity onPress={() => setSecureEntry(prevSecure => !prevSecure)} activeOpacity={1} style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                    <Ionicons name={secureEntry ? "eye-outline" : "eye-off-outline"} color={Colors.PRIMARY_LIGHT} size={fontSize} />
                </TouchableOpacity>
            }
        </View>
    )
}