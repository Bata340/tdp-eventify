import { View, ScrollView, Image, Text, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PaymentForm from '../components/PaymentForm';
import Colors from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function EventPaymentForm ( { route } ) {

    const navigation = useNavigation();
    const event = route.params?.event;

    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingBottom: 20, paddingTop: 40 }}>
            <ScrollView>
                <TouchableHighlight
                    style={{ position: 'absolute', top: 20, left: 20, zIndex: 1, borderRadius: 30 }}
                    activeOpacity={1}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" color={Colors.WHITE} size={32} />
                </TouchableHighlight>
                <View style={{alignItems: "center", justifyContent:"center"}}>
                    <View style={{ borderRadius: 20, width: '90%', overflow: 'hidden', backgroundColor:Colors.PRIMARY_VERY_LIGHT}}>
                        <View>
                            <Image source={{uri:event.image}} style={{ height:150 }} />
                            <LinearGradient
                                colors={['transparent', Colors.PRIMARY_VERY_LIGHT]}
                                style={{ width: '100%', height: 50, position: 'absolute', bottom: 0, marginBottom: -17 }}
                            />
                        </View>
                        <View style={{paddingTop:10, paddingBottom:10, width:'100%', alignItems: 'center'}}>
                            <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 30 }}>{event.name}</Text>
                        </View>
                        <View style={{paddingBottom:20, width:'100%'}}>
                            <View style={{paddingLeft:10}}>
                                <View style={{display: 'flex', flexDirection: 'row', paddingRight:20}}>
                                    <Text style={{color: Colors.DARK_GRAY, fontSize: 20, fontWeight: 'bold', flex: 8}}>Precio del evento:</Text>
                                    <Text style={{color: Colors.DARK_GRAY, fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'right'}}>$</Text>
                                    <Text style={{color: Colors.DARK_GRAY, fontSize: 20, fontWeight: 'bold', flex: 4, textAlign: 'right'}}>{event.price.toFixed(2)}</Text>
                                </View>
                                <View style={{display: 'flex', flexDirection: 'row', paddingRight:20}}>
                                    <Text style={{color: Colors.DARK_GRAY, fontSize: 20, fontWeight: 'bold', flex: 8}}>Pago por servicio:</Text>
                                    <Text style={{color: Colors.DARK_GRAY, fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'right'}}>$</Text>
                                    <Text style={{color: Colors.DARK_GRAY, fontSize: 20, fontWeight: 'bold', flex: 4, textAlign: 'right'}}>{(parseFloat(event.price)*0.05).toFixed(2)}</Text>
                                </View>
                                
                            </View>
                            <Text style={{color: Colors.DARK_GRAY, fontSize: 30, fontWeight: 'bold', textAlign:"center", marginTop:10}}>
                                $ {parseFloat(event.price)+parseFloat((parseFloat(event.price)*0.05).toFixed(2))}
                            </Text>
                        </View>
                    </View>
                </View>
                <PaymentForm event={event}/>
            </ScrollView>
        </View>
    );
}