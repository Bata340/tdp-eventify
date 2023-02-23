import { View, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { EventsList } from '../components/EventsList';
import { HeaderUser } from '../components/HeaderUser';


export default function EventsScreen() {

    const navigation = useNavigation();
    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingBottom: 100, minHeight:Dimensions.get("window").height }}>
            <HeaderUser navigation={navigation}/>
            <EventsList/>
        </View>
    )
}