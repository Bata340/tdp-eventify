import React from 'react';
import { Image, Text, TouchableHighlight, View, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

export default function EventDetailScreen({ route, navigation }) {

    const event = route.params?.event;

    return (
        <View style={{ flexDirection: 'column', width: '100%', paddingTop: 50, height: '100%', backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, alignContent: 'center' }}>
            <View>
                <TouchableHighlight
                    style={{ position: 'absolute', top: 20, left: 20, zIndex: 1, borderRadius: 30 }}
                    activeOpacity={1}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" color={Colors.WHITE} size={32} />
                </TouchableHighlight>
                <Image style={{ width: '100%', height: 200, resizeMode: 'cover' }} source={{ uri: event.image }} />
                <LinearGradient
                    colors={['transparent', Colors.PRIMARY_VERY_DARK_GRAYED]}
                    style={{ width: '100%', height: 100, position: 'absolute', bottom: 0, marginBottom: -17 }}
                />
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 35 }}>{event.name}</Text>
            </View>
            <ScrollView style={{ paddingHorizontal: 20 }}>
                <Text style={{ color: Colors.WHITE, fontSize: 20, marginTop: 15 }}>{event.description}</Text>
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 16, marginTop: 10 }}><Feather name="calendar" /> {event.date} {event.time}hs</Text>
                </View>
                <View style={{ marginTop: 20, borderRadius: 20, backgroundColor: Colors.PRIMARY_DARK_GRAYED, paddingLeft: 25, paddingVertical: 25 }}>
                    <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 20, marginTop: 5 }}><Entypo size={25} name="address" /> {event.location}</Text>
                </View>
                <View style={{ marginTop: 20, paddingBottom: 20, width: '100%', alignContent: 'center' }}>
                    <Button 
                        type="large"
                        title="COMPRAR" 
                        onPress={() => {
                            navigation.navigate("EventPayment", {event} );
                        }} 
                        titleSize={20} />
                </View>
            </ScrollView>
        </View>
    )
}