import React from 'react';
import { Image, Text, TouchableHighlight, View, ScrollView, Alert } from 'react-native';
import Colors from '../constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { StackActions } from '@react-navigation/native';
import { useGlobalAuthContext } from '../utils/ContextFactory';
import AppConstants from '../constants/AppConstants';

export default function EventDetailScreen({ route, navigation }) {

    const event = route.params?.event;
    const isBuy = route.params?.isBuy;
    const appAuthContext = useGlobalAuthContext();
    const userEmail = appAuthContext.userSession.getUserEmail();


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
                            text: "OK",
                            onPress: () => {navigation.dispatch(StackActions.pop(1));}
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
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 32, marginTop: 10 }}>$ {parseFloat(event.price).toFixed(2)}</Text>
                </View>
                <View style={{ marginTop: 20, borderRadius: 20, backgroundColor: Colors.PRIMARY_DARK_GRAYED, paddingLeft: 25, paddingVertical: 25 }}>
                    <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 20, marginTop: 5 }}><Entypo size={25} name="address" /> {event.location}</Text>
                </View>
                <View style={{ marginTop: 20, paddingBottom: 20, width: '100%', alignContent: 'center' }}>
                    {
                    event.owner == userEmail ?
                    <>
                        <Button
                            title="Editar"
                            titleColor={Colors.PRIMARY_VERY_DARK_GRAYED}
                            color={Colors.PRIMARY_LIGHT}
                            buttonStyle={{ verticalPadding: 30, paddingHorizontal: 100, marginBottom: 20 }}
                            onPress = {() => {navigation.navigate("EventEdit", {"event": event})}}
                        />
                        <Button
                            title="Borrar"
                            titleColor={Colors.WHITE}
                            color={"#ff0000"}
                            buttonStyle={{ verticalPadding: 30, paddingHorizontal: 100 }}
                            onPress = {() => {showDeleteAlert();}}
                        />
                    </>
                    :
                        (isBuy?
                            <Button 
                                type="large"
                                title="COMPRAR" 
                                onPress={() => {
                                    navigation.navigate("EventPayment", {event} );
                                }} 
                                titleSize={20} 
                            />
                        :
                            <Button 
                                type="large"
                                title="VER ENTRADA" 
                                onPress={() => {
                                    navigation.navigate("EventQR", {event} );
                                }} 
                                titleSize={20}
                                titleStyle={{ fontWeight: "bold", textAlign:"center" }}
                                numOfLines={2}
                            />)
                    }
                </View>
            </ScrollView>
        </View>
    )
}