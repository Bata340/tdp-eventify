import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import Colors from '../constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function EventDetailScreen({ route, navigation }) {

    return (
        <View style={{ flexDirection: 'column', width: '100%', paddingTop: 50, height: '100%', backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, alignContent: 'center' }}>
            <View style={{ flex: 55 }}>
                <TouchableHighlight
                    style={{ position: 'absolute', top: 20, left: 20, zIndex: 1, borderRadius: 30 }}
                    activeOpacity={1}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" color={Colors.WHITE} size={32} />
                </TouchableHighlight>
                <Image style={{ width: '100%', height: 400, resizeMode: 'cover' }} source={{ uri: route.params?.event.image }} />
                <LinearGradient
                    colors={['transparent', Colors.PRIMARY_VERY_DARK_GRAYED]}
                    style={{ width: '100%', height: 300, position: 'absolute', bottom: 0, marginBottom: -17 }}
                />
            </View>
            <View style={{ flex: 40, paddingHorizontal: 20 }}>
                <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 35 }}>{route.params?.event.name}</Text>
                <Text style={{ color: Colors.WHITE, fontSize: 20, marginTop: 15 }}>Festival de musica con las mejores bandas de rock, punk, indie, electronica y cumbia</Text>
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 16, marginTop: 10 }}><Feather name="calendar" /> {route.params?.event.date} {route.params?.event.time}hs</Text>
                </View>
                <View style={{ marginTop: 20, borderRadius: 20, backgroundColor: Colors.PRIMARY_DARK_GRAYED, paddingLeft: 25, paddingVertical: 25 }}>
                    <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 20, marginTop: 5 }}><Entypo size={25} name="address" /> {route.params?.event.location}</Text>
                </View>
            </View>
            <View style={{ flex: 15, width: '100%', alignContent: 'center' }}>
                    <Button type="large" title="COMPRAR" titleSize={20} />
                </View>
        </View>
    )
}