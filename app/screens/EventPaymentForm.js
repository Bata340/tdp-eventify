import { View, ScrollView, Image, Text } from 'react-native';
import PaymentForm from '../components/PaymentForm';
import Colors from '../constants/Colors';
const EventifyLogo = require('../assets/eventify-logo.png');


export default function EventPaymentForm ( { route } ) {

    const event = route.params?.event;

    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingBottom: 20, paddingTop: 40 }}>
            <ScrollView>
                <View style={{alignItems: "center", justifyContent:"center"}}>
                    <View style={{ borderRadius: 20, width: '90%', overflow: 'hidden', backgroundColor:/*Colors.PRIMARY_VERY_LIGHT*/Colors.PRIMARY_LIGHT}}>
                        <Image source={{uri:event.image}} style={{ height:150}} />
                        <View style={{paddingTop:20, paddingBottom:20, width:'100%', alignItems: 'center'}}>
                            <Text style={{ color: Colors.PRIMARY_VERY_DARK, fontWeight: 'bold', fontSize: 30 }}>{event.name}</Text>
                        </View>
                        <View style={{paddingBottom:20, width:'100%', alignItems: 'center'}}>
                            <Text style={{color: Colors.DARK_GRAY, fontSize: 30, fontWeight: 'bold'}}>
                                $ {"250.00"}
                            </Text>
                        </View>
                    </View>
                </View>
                <PaymentForm/>
            </ScrollView>
        </View>
    );
}