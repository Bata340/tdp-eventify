import React, { useEffect, useState } from 'react'
import { ScrollView, View, ActivityIndicator, RefreshControl, Image, Text } from 'react-native';
import AppConstants from '../constants/AppConstants';
import EventCard from './EventCard';
import { getFirebaseImage } from '../utils/FirebaseHandler';
import { useGlobalAuthContext } from '../utils/ContextFactory';

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const EventsListQR = () => {

    const appAuthContext = useGlobalAuthContext();
    const userEmail = appAuthContext.userSession.getUserEmail();
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    async function getEventsReservations(){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/user/event-reservations/${userEmail}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayEvents = [];
                for(let i=0; i<jsonResponse.length; i++){
                    const date = new Date(jsonResponse[i].event_data.eventDates[0]);
                    let imageURI;
                    try{
                        imageURI = await getFirebaseImage("files/"+jsonResponse[i].event_data.photos[0]);
                    }catch(exception){
                        //Image not available
                        imageURI = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
                    }
                    arrayEvents.push({
                        _id: jsonResponse[i].event_data._id.$oid,
                        id: jsonResponse[i].event_data.key,
                        name: jsonResponse[i].event_data.name,
                        image: jsonResponse[i].event_data.photos ? jsonResponse[i].event_data.photos[0] : null,
                        isoStringDate: jsonResponse[i].event_data.eventDates[0],
                        date: `${date.getDate().toString().padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`,
                        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
                        location: jsonResponse[i].event_data.location,
                        description: jsonResponse[i].event_data.description,
                        price: jsonResponse[i].event_data.price,
                        owner: jsonResponse[i].owner,
                        image: imageURI,
                        dataQR: {
                            "eventId": jsonResponse[i].event_id, 
                            "userEmail": jsonResponse[i].userid, 
                            "dateReserved": jsonResponse[i].dateReserved, 
                            "typeOfCard": jsonResponse[i].typeOfCard, 
                            "idReservation": jsonResponse[i]._id.$oid
                        }
                    });
                }
                setEvents(arrayEvents);
                setIsLoading(false);
            }else{
                setIsLoading(false);
            }
        }     
    }
  
  
    useEffect( () => {
        getEventsReservations();
    // eslint-disable-next-line
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getEventsReservations();
        setRefreshing(false);
    }

    return (
        <ScrollView
            contentContainerStyle={{ alignItems: 'center', paddingTop: 30 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} 
                    onRefresh={onRefresh} />
            }
        >
            {
            !isLoading ?
                (events.length > 0 ?
                    events.map(e => <EventCard key={'event-card-' + e.dataQR.idReservation + '-' + e._id} event={e} isBuy={false} />)
                : 
                <View style={{alignItems: 'center', borderWidth:5, borderRadius:20, borderColor: 'black', padding:10}}>
                    <Image style={{ height: 150, width:150 }} source={{uri: "https://cdn-icons-png.flaticon.com/512/4406/4406665.png"}}/>
                    <Text style={{fontSize: 20, color:"white", marginTop: 10}}>Aún no posees tickets comprados...</Text>
                </View>
                )
            :
                <ActivityIndicator size="large" color="#00ff00" />
            }
            <View style={{ height: 230 }}></View>
        </ScrollView>
    );
}