import React, { useEffect, useState } from 'react';
import { Image, View, Text, TouchableOpacity, EventSubscriptionVendor } from 'react-native';
import Colors from '../constants/Colors';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useGlobalAuthActionsContext, useGlobalAuthContext } from '../utils/ContextFactory';

export default function EventCard({
    event = {}
}) {
    const appAuthContext = useGlobalAuthContext();
    const setAppAuthContext = useGlobalAuthActionsContext();
    const [isFaved, setIsFaved] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        setIsFaved(appAuthContext.favorites.some(e => e.id == event.id));
    }, [appAuthContext]);

    const onFavoritePress = () => {
        setIsFaved(prevFavedState => {
            if (prevFavedState) {
                setAppAuthContext(prevState => ({
                    ...prevState,
                    favorites: prevState.favorites.filter(e => e.id != event.id) 
                }));
            }
            else {
                setAppAuthContext(prevState => ({
                    ...prevState,
                    favorites: prevState.favorites.concat(event)
                }));
            }

            return !prevFavedState;
        });
    }

    const onCardPress = () => {
        navigation.navigate('EventDetail', { event });  
    }

    return (
        <>
            <View style={{ borderRadius: 30, height: 250, width: '90%', overflow: 'hidden' }}>
                <Image style={{ height: 250 }} source={{ uri: event.image }} />
                <TouchableOpacity
                    style={{ borderRadius: 50, backgroundColor: Colors.WHITE, height: 50, width: 50, alignItems: 'center', alignContent: 'center', justifyContent: 'center', left: '80%', top: '10%', position: 'absolute' }}
                    onPress={onFavoritePress}
                    activeOpacity={1}
                >
                    {isFaved ? 
                        <AntDesign name="heart" color={Colors.PRIMARY_DARK} size={23} />
                        :
                        <AntDesign name="hearto" color={Colors.GRAY} size={23} />
                    }
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={{ borderRadius: 20, width: '80%', marginTop: '-15%', marginBottom: 20, backgroundColor: Colors.PRIMARY_DARK_GRAYED, padding: '3%', display: 'flex', flexDirection: 'row' }}
                onPress={onCardPress}
            >
                <View style={{ flex: 7 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 26, color: Colors.WHITE }}>{event.name}</Text>
                    <Text style={{ color: Colors.WHITE, fontSize: 16, marginTop: 10 }}><Feather name="calendar" /> {event.date} {event.time}hs</Text>
                    <Text style={{ color: Colors.WHITE, fontSize: 16, marginTop: 5 }}><Entypo name="address" /> {event.location}</Text>
                </View>
                <View style={{ flex: 3, justifyContent: 'center' }}>
                    <Text
                        style={{ fontWeight: 'bold', fontSize: 15, color: Colors.WHITE, textAlign:"center", marginBottom: 20 }}
                    >
                        $ {parseFloat(event.price).toFixed(2)}
                    </Text>
                    <Button
                        title="Comprar"
                        titleColor={Colors.PRIMARY_VERY_DARK_GRAYED}
                        color={Colors.PRIMARY_LIGHT}
                        buttonStyle={{ verticalPadding: 30 }}
                        onPress = {() => navigation.navigate("EventPayment", { event })}
                    />
                </View>
            </TouchableOpacity>
        </>
    )
}