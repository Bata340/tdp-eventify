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
import { EventsList } from '../components/EventsList';
import { HeaderUser } from '../components/HeaderUser';


export default function EventsScreen({ route, navigaton }) {
    const appAuthContext = useGlobalAuthContext();


    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingBottom: 100 }}>
            
            <HeaderUser navigation={navigaton}/>

            <EventsList/>
        </View>
    )
}