import EventForm from '../components/EventForm';
import { View, ScrollView, Text } from 'react-native';
import Colors from '../constants/Colors';
import ScreenTitle from '../components/ScreenTitle';


export default function EditEventScreen () {
    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK, paddingBottom: 50, paddingTop: 100 }}>
            <View style={{alignItems: "center", justifyContent:"center"}}>
                <Image source={EventifyLogo} style={{ height: 75, resizeMode: 'contain'}} />
                <ScreenTitle title="EDITA TU EVENTO" />
            </View>
            <ScrollView>
                <EventForm getPrevData={true}/>
            </ScrollView>
        </View>
    );
}