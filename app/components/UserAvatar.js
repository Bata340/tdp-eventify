import React from 'react';
import { Image, View } from 'react-native';


export default function UserAvatar({
    uri = "",
    size = 30
}) {

    const imagePath = uri !== ""? { uri: uri }: {uri : "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"}

    return(
        <View style={{ borderRadius: size * 2, width: size, height: size, overflow: 'hidden', alignItems: 'center' }}>
            <Image
                style={{ height: size, width: size }}
                
                source={imagePath}
            />
        </View>
    )
}