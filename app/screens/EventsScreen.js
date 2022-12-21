import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import UserAvatar from '../components/UserAvatar';
import EventCard from '../components/EventCard';
import { useGlobalAuthContext } from '../utils/ContextFactory';

export default function EventsScreen({ route, navigaton }) {
    const appAuthContext = useGlobalAuthContext();

    const events = [
        { id: 1, name: 'Lollapalooza 2023', image: "https://static.eldiario.es/clip/69d5aa49-6431-4969-9bde-f8b507544124_16-9-discover-aspect-ratio_default_0.jpg", date: '17 Mar, 2023', time: '20:00', location: 'Bernabe Marquez 700, San Isidro', description: "Festival de musica con las mejores bandas de rock, punk, indie, electronica y cumbia" },
        { id: 2, name: 'BNN', image: "https://exambazaar-2020.s3.amazonaws.com/7840163a82fdf16df256e63fdcbdff21.JPG", date: '03 Dic, 2022', time: '23:00', location: 'Av. Costanera 6201, CABA', description: "Joda con las mejores bandas de electronica y cumbia" },
        { id: 3, name: 'Opeth', image: "https://cuarteldelmetal.com/wp-content/uploads/2020/07/Opeth-1-1-1.jpg", date: '13 Feb, 2023', time: '19:00', location: 'Av. Rivadavia 7806, CABA', description: "Venite a ver a Opeth en vivo!" }
    ];

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
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Button
                            title={"EVENTOS\nPOPULARES"}
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
                </View>
            </View>
            <ScrollView
                contentContainerStyle={{ alignItems: 'center', paddingTop: 30 }}
            >
                {events.map(e => <EventCard key={'event-card-' + e.id} event={e} />)}
                <View style={{ height: 230 }}></View>
            </ScrollView>
        </View>
    )
}