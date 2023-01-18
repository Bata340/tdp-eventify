import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import EventCard from '../components/EventCard';
import ScreenTitle from '../components/ScreenTitle';
import Colors from '../constants/Colors';
import { useGlobalAuthContext } from '../utils/ContextFactory';

export default function FavoritesScreen({ route, navigaton }) {
    const appAuthContext = useGlobalAuthContext();

    return (
        <View style={{ width: '100%', paddingTop: 50, height: '100%', backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, alignContent: 'center' }}>
            <ScreenTitle title="Mis eventos favoritos" />
            <ScrollView
                contentContainerStyle={{ alignItems: 'center', paddingTop: 30 }}
            >
                {
                    appAuthContext.favorites.length > 0 ?
                        appAuthContext.favorites.map(e => <EventCard key={'favorite-card-' + e.id} event={e} />)
                    :
                        <View style={{alignItems: 'center', borderWidth:5, borderRadius:20, borderColor: 'black', padding:10}}>
                            <Image style={{ height: 150, width:150 }} source={{uri: "https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/favorite-empty-512.png"}}/>
                            <Text style={{fontSize: 20, color:"white", marginTop: 10}}>Aún no posees eventos favoritos...</Text>
                        </View>
                }
                <View style={{ height: 230 }}></View>
            </ScrollView>
        </View>
    )
}