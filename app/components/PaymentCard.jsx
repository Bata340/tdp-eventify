import React, { useState } from 'react'
import { Image, Text, TouchableHighlight, View, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export const PaymentCard = ({payment} ) => {
    const [toggle, setToggle] = useState(false);
    const onPressButton = ()=> {
        setToggle(!toggle);
      };

  return (
    //height:`${toggle ? 30:10}%`
        <TouchableHighlight style={{width:'90%' , backgroundColor: Colors.PRIMARY_DARK_GRAYED  , borderRadius:10 , marginBottom:10}} onPress={ onPressButton}>
            
            <View style= {{padding:10 , justifyContent:'center'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize:20, textAlign:'left'}}>{payment.name}</Text>
            <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize:20,textAlign:'right'}}>${payment.value}</Text>
            </View>
            
            {toggle ? 
            <View style= {{padding:10 }}>
                <Text style={{ fontWeight: 'normal', fontStyle:'italic', color: Colors.WHITE,  fontSize:18}}>Transacción N°1</Text>
                <Text style={{ fontWeight: 'normal', color: Colors.WHITE,  fontSize:18}}>
                    <Text>Pagado con tarjeta **</Text>   
                    <Text style={{fontWeight:'bold'}}>{1233}
                    </Text>
                    </Text>
                <Text style={{ fontWeight: 'normal', color: Colors.WHITE,  fontSize:16}}>
                    <Text>Fecha de pago: </Text>
                    <Text style={{fontWeight:'bold'}}>{1233}
                    </Text>
                    </Text>
            </View>
             : 
            <View >
                
            </View>
        
            }
            </View>
            
        
        </TouchableHighlight>
  )
}
