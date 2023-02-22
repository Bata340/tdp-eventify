import React, { useEffect, useState } from 'react'
import { ScrollView, View, ActivityIndicator, RefreshControl, Image, Text } from 'react-native';
import AppConstants from '../constants/AppConstants';
import EventCard from './EventCard';
import { getFirebaseImage } from '../utils/FirebaseHandler';
import { useGlobalAuthContext } from '../utils/ContextFactory';
const NoEventsPhoto = require('../assets/events.png');

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const MyEventsList = () => {

    const appAuthContext = useGlobalAuthContext();
    const userEmail = appAuthContext.userSession.getUserEmail();
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    async function getMyEvents(){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/events?owner=${userEmail}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayEvents = [];
                for(let i=0; i<jsonResponse.length; i++){
                    const date = new Date(jsonResponse[i].eventDates[0]);
                    let imageURI;
                    try{
                        imageURI = await getFirebaseImage("files/"+jsonResponse[i].photos[0]);
                    }catch(exception){
                        //Image not available
                        imageURI = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
                    }
                    arrayEvents.push({
                        _id: jsonResponse[i]._id.$oid,
                        id: jsonResponse[i].key,
                        name: jsonResponse[i].name,
                        image: jsonResponse[i].photos ? jsonResponse[i].photos[0] : null,
                        isoStringDate: jsonResponse[i].eventDates[0],
                        date: `${date.getDate().toString().padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`,
                        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
                        location: jsonResponse[i].location,
                        description: jsonResponse[i].description,
                        price: jsonResponse[i].price,
                        owner: jsonResponse[i].owner,
                        image: imageURI,
                    });
                }
                setIsLoading(false);
                setEvents(arrayEvents);
            }
        }else{
            setIsLoading(false);
        }     
    }
  
  
    useEffect( () => {
        getMyEvents();
    // eslint-disable-next-line
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getMyEvents();
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
                events.map(e => <EventCard key={'event-card-' + '-' + e._id} event={e} />)
                : 
                <View style={{alignItems: 'center', borderWidth:5, borderRadius:20, borderColor: 'black', padding:10}}>
                    <Image style={{ height: 150, width:150 }} source={NoEventsPhoto}/>
                    <Text style={{fontSize: 20, color:"white", marginTop: 10}}>Aún no posees eventos creados...</Text>
                </View>)
            :
                <ActivityIndicator size="large" color="#00ff00" />
            }
            <View style={{ height: 230 }}></View>
        </ScrollView>
    );
}