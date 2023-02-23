import React, { useEffect, useState } from 'react';
import { Image, View, Text, TouchableOpacity, EventSubscriptionVendor, Alert } from 'react-native';
import Colors from '../constants/Colors';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useGlobalAuthActionsContext, useGlobalAuthContext } from '../utils/ContextFactory';
import AppConstants from '../constants/AppConstants';
import { postDataToURL } from '../utils/FetchAPI';

export default function EventCard({
    event = {},
    isBuy = true,
}) {
    const appAuthContext = useGlobalAuthContext();
    const setAppAuthContext = useGlobalAuthActionsContext();
    const userEmail = appAuthContext.userSession.getUserEmail();
    const [isFaved, setIsFaved] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        setIsFaved(event.isFav);
    }, [event]);

    const onFavoritePress = () => {
        postDataToURL(
            `${AppConstants.API_URL}/events/favourites/toggle`,
            {
                "user_email": userEmail,
                "event_id": event._id
            }
        );
        setIsFaved(!isFaved);
    }

    const onCardPress = () => {
        navigation.navigate('EventDetail', { event, isBuy });  
    }


    const handleDelete = async () => {
        const paramsDel = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/event/${event._id}`;
        const response = await fetch(
            url,
            paramsDel
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                Alert.alert(
                    "Borrado exitoso", 
                    "El evento ha sido borrado exitosamente.",
                    [
                        {
                            text: "OK"
                        }
                    ]
                ); 
            }else{
                Alert.alert(
                    "Error al borrar", 
                    json_response.detail,
                    [
                        {
                            text: "OK"
                        }
                    ]
                );
            }
        }else{
            Alert.alert(
                "Error al borrar", 
                "Error al intentar eliminar el evento. Intente nuevamente.",
                [
                    {
                        text: "OK"
                    }
                ]
            );
        }
    }


    const showDeleteAlert = () => {
        Alert.alert(
            `¿Está seguro que desea borrar el evento ${event.name}?`, 
            "Si borra este evento ya no podrá recuperarlo posteriormente. ¿Desea continuar?",
            [
                {
                    text: "BORRAR",
                    onPress: () => handleDelete(),
                    style: {color: "red"}
                },
                {
                    text: "CANCELAR"
                }
            ]
        );
    }

    return (
        <>
            <View style={{ borderRadius: 20, height: 200, width: '90%', overflow: 'hidden' }}>
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
                    {
                    (event.owner == userEmail) ?
                        <>
                            <Button
                                title="Editar"
                                titleColor={Colors.PRIMARY_VERY_DARK_GRAYED}
                                color={Colors.PRIMARY_LIGHT}
                                buttonStyle={{ verticalPadding: 30 }}
                                onPress = {() => {navigation.navigate("EventEdit", {"event": event})}}
                            />
                            <Button
                                title="Borrar"
                                titleColor={Colors.WHITE}
                                color={"#ff0000"}
                                buttonStyle={{ verticalPadding: 30 }}
                                onPress = {() => {showDeleteAlert();}}
                            />
                        </>
                    :
                        (isBuy ? 
                        <Button
                            title="Comprar"
                            titleColor={Colors.PRIMARY_VERY_DARK_GRAYED}
                            color={Colors.PRIMARY_LIGHT}
                            buttonStyle={{ verticalPadding: 30 }}
                            onPress = {() => navigation.navigate("EventPayment", { event })}
                        /> :
                        <Button
                            title="Ver QR"
                            titleColor={Colors.PRIMARY_VERY_DARK_GRAYED}
                            color={Colors.PRIMARY_LIGHT}
                            buttonStyle={{ verticalPadding: 30 }}
                            onPress = {() => {navigation.navigate("EventQR", {"dataQR": event.dataQR, "event": event})}}
                        />
                        )
                    }
                </View>
            </TouchableOpacity>
        </>
    )
}