import { View, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { EventsListQR } from './EventsListQR';
import { HeaderUser } from './HeaderUser';
import { useNavigation } from '@react-navigation/native';


export default function MyTickets() {
    const navigation = useNavigation();

    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingBottom: 200, minHeight:Dimensions.get("window").height }}>
            <EventsListQR/>
        </View>
    );
}