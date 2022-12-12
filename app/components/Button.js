import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import Colors from '../constants/Colors';

export default function Button({ 
    title = "",
    titleColor = Colors.PRIMARY_DARKER,
    titleSize = 15,
    titleStyle = {},
    onPress = () => {},
    disabled = false,
    color = Colors.PRIMARY_LIGHT,
    buttonStyle = {},
    inactive = false,
    type = "small" //"small", "medium", "large"
}) {
    const underlayColor = shade(color, 0.4);

    const getHorizontalPadding = () => {
        switch(type) {
            case "large": return '30%';
            case "medium": return '20%';
            default: return '10%';
        }
    }

    function hex2(c) {
        c = Math.round(c);
        if (c < 0) c = 0;
        if (c > 255) c = 255;
    
        var s = c.toString(16);
        if (s.length < 2) s = "0" + s;
    
        return s;
    }
    
    function fromRgb(r, g, b) {
        return "#" + hex2(r) + hex2(g) + hex2(b);
    }
    
    function shade(col, light) {
        var r = parseInt(col.substr(1, 2), 16);
        var g = parseInt(col.substr(3, 2), 16);
        var b = parseInt(col.substr(5, 2), 16);
    
        if (light < 0) {
            r = (1 + light) * r;
            g = (1 + light) * g;
            b = (1 + light) * b;
        } else {
            r = (1 - light) * r + light * 255;
            g = (1 - light) * g + light * 255;
            b = (1 - light) * b + light * 255;
        }
    
        return fromRgb(r, g, b);
    }

    return (
        <TouchableHighlight 
            style={[{ borderRadius: '50%', paddingVertical: '7%', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: getHorizontalPadding(), backgroundColor: inactive ? 'transparent' : color, alignItems: 'center' }, {...buttonStyle}]}
            onPress={onPress}
            disabled={disabled}
            underlayColor={underlayColor}
        >
            {inactive ? 
                <Text numberOfLines={1} style={[{ color: Colors.PRIMARY_DARK_GRAYED, fontSize: titleSize }, { ...titleStyle }]}>{title}</Text>
            :
                <Text numberOfLines={1} style={[{ color: titleColor, fontSize: titleSize, fontWeight: 'bold' }, { ...titleStyle }]}>{title}</Text>
            }

        </TouchableHighlight>
    )
}