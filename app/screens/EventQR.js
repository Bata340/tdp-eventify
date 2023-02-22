import { View, Image, TouchableHighlight, Text, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import ScreenTitle from '../components/ScreenTitle';
import QRCode from 'react-native-qrcode-svg';
const EventifyLogo = require('../assets/eventify-logo.png');
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AddEventScreen ({route}) {

    const event = route.params?.event;
    const dataQR = route.params?.dataQR;

    return (
        <>
            <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK, paddingBottom: 50, paddingTop: 100, height: "100%"}}>
                <View style={{alignItems: "center", justifyContent:"center"}}>
                    <TouchableHighlight
                        style={{ position: 'absolute', top: -30, left: 20, zIndex: 1, borderRadius: 30 }}
                        activeOpacity={1}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" color={Colors.WHITE} size={32} />
                    </TouchableHighlight>
                    <Image source={EventifyLogo} style={{ height: 75, resizeMode: 'contain', paddingBottom:25}} />
                    <ScreenTitle title={event.name} />
                </View>
                <View style={{alignItems: "center", justifyContent:"center", marginTop:20}}>
                    <QRCode
                        size={300}
                        value = {JSON.stringify(dataQR)}
                    />
                </View>
            </View>
        </>
        
    );
}