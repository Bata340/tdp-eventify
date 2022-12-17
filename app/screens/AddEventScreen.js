import EventForm from '../components/EventForm';
import { View, ScrollView, Text } from 'react-native';
import Colors from '../constants/Colors';
import ScreenTitle from '../components/ScreenTitle';


export default function AddEventScreen () {
    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK, paddingBottom: 50, paddingTop: 100 }}>
            <ScreenTitle title="CREA TU EVENTO" />
            <ScrollView >
                <EventForm />
            </ScrollView>
        </View>
    );
}