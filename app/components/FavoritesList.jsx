import React from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator, RefreshControl } from 'react-native';
import EventCard from '../components/EventCard';
import ScreenTitle from '../components/ScreenTitle';
import Colors from '../constants/Colors';
import { useGlobalAuthContext } from '../utils/ContextFactory';
import AppConstants from '../constants/AppConstants';
import {fetchFromURL} from '../utils/FetchAPI';
import { getFirebaseImage } from '../utils/FirebaseHandler';


const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const FavoritesList = () => {
    const appAuthContext = useGlobalAuthContext();
    const userEmail = appAuthContext.userSession.getUserEmail();

    const [favEvents, setFavEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);


    const fetchFavList = async () => {
        setLoading(true);
        const jsonResponse = await fetchFromURL(
            `${AppConstants.API_URL}/events/favourites`,
            {"user_email": userEmail}
        );
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
                isFav: jsonResponse[i].is_favourite,
            });
        }
        setFavEvents(arrayEvents);
        setLoading(false);
    }

    React.useEffect(() => {
        fetchFavList();
    }, [])

    return (
        // <View style={{ width: '100%', paddingTop: '2%', height: '100%', backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, alignContent: 'center' }}>
            //<ScreenTitle title="Mis eventos favoritos" />
            <ScrollView
                contentContainerStyle={{ alignItems: 'center', paddingTop: '2%', height:'100%' }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} 
                        onRefresh={fetchFavList}  />
                }
            >
                {
                loading ? 
                    <ActivityIndicator size="large" color="#00ff00" style={{height:'100%'}} />
                :
                    (
                        favEvents.length > 0 ?
                            favEvents.map(e => <EventCard key={'favorite-card-' + e._id.$oid} event={e} />)
                        :
                            <View style={{alignItems: 'center', borderWidth:5, borderRadius:20, borderColor: 'black', padding:10}}>
                                <Image style={{ height: 150, width:150 }} source={{uri: "https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/favorite-empty-512.png"}}/>
                                <Text style={{fontSize: 20, color:"white", marginTop: 10}}>Aún no posees eventos favoritos...</Text>
                            </View>
                    )
                }
                
            </ScrollView>
        // </View>
    )
}
