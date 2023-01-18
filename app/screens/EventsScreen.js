import { useEffect, useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import UserAvatar from '../components/UserAvatar';
import EventCard from '../components/EventCard';
import { useGlobalAuthContext } from '../utils/ContextFactory';
import AppConstants from '../constants/AppConstants';
import { getFirebaseImage } from '../utils/FirebaseHandler';

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function EventsScreen({ route, navigaton }) {
    const appAuthContext = useGlobalAuthContext();
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);


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
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingBottom: 100 }}>
            <View style={{ paddingHorizontal: 30, paddingTop: 60, paddingBottom: 30, backgroundColor: Colors.PRIMARY_DARKER, borderBottomLeftRadius: 40, borderBottomRightRadius: 40}}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 3 }}>
                        <Text style={{ color: Colors.WHITE, fontSize: 22 }}><Ionicons size={23} color={Colors.PRIMARY} name="location-outline" />  Buenos Aires</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 1, display: 'flex', flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <FontAwesome name="bell-o" color={Colors.WHITE} size={25} />
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <UserAvatar size={50} uri={appAuthContext.userSession.getUserAvatar()} />
                        </View>
                    </View>
                </View>
                <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 35, marginTop: 25 }}>Hola,{"\n"}{appAuthContext.userSession.getUserFullName()}</Text>
                {/*<View style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Button
                            title={"EVENTOS POPULARES"}
                            color={Colors.PRIMARY}
                            titleColor={Colors.WHITE}
                            titleSize={16}
                            titleStyle={{ fontWeight: "bold", textAlign:"center" }}
                            style={{width: "100%"}}
                            numOfLines={2}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button
                            numberOfLines={2}
                            title={"EVENTOS\nCERCANOS"}
                            color={Colors.PRIMARY}
                            titleColor={Colors.WHITE}
                            titleSize={16}
                            titleStyle={{ fontWeight: "bold", textAlign:"center" }}
                            inactive={true}
                            numOfLines={2}
                        />
                    </View>
                </View>*/}
            </View>
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
        </View>
    )
}