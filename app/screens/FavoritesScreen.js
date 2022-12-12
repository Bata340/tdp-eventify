import React from 'react';
import { ScrollView, View } from 'react-native';
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
                {appAuthContext.favorites.map(e => <EventCard key={'favorite-card-' + e.id} event={e} />)}
                <View style={{ height: 230 }}></View>
            </ScrollView>
        </View>
    )
}