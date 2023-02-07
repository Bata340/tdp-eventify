import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import AppConstants from '../constants/AppConstants';
import EventCard from './EventCard';
import { useGlobalAuthContext } from '../utils/ContextFactory';
import { getFirebaseImage } from '../utils/FirebaseHandler';

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

async function getImagesFromFireBase( eventos ){
    const urlsArray = [];
    for ( let i=0; i < eventos.length ; i++ ){
        if(eventos[i].photos.length > 0){
            const url = await getFirebaseImage( 
                `files/${eventos[i].photos[0]}`
            );
            urlsArray.push(url);
        }else{
          urlsArray.push("");
        }
        
    }
    setEventos( eventos );
    setLoading( false );
}

export const EventsList = (id_persona = '') => {

    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);


    async function getEvents(){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/events`;
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
                        date: `${date.getDate().toString().padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`,
                        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
                        location: jsonResponse[i].location,
                        description: jsonResponse[i].description,
                        price: jsonResponse[i].price,
                        image: imageURI
                    });
                }
                setEvents(arrayEvents);
            }
        }     
    }
  
  
    useEffect( () => {
        getEvents();
    // eslint-disable-next-line
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getEvents();
        setRefreshing(false);
      };
  return (
    <ScrollView
                    contentContainerStyle={{ alignItems: 'center', paddingTop: 30 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} 
                          onRefresh={onRefresh} />
                    }
                >
                    {
                    events.length > 0 ?
                        events.map(e => <EventCard key={'event-card-' + e.id+'-'+e._id} event={e} />)
                    :
                        <ActivityIndicator size="large" color="#00ff00" />
                    }
                    <View style={{ height: 230 }}></View>
                </ScrollView>
  )
}
