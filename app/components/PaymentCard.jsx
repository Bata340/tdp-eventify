import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableHighlight, View, ScrollView, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import AppConstants from '../constants/AppConstants';

export const PaymentCard = ({payment} ) => {
    const [toggle, setToggle] = useState(false);
    const [event, setEvent] = useState([]);
    const [debito, setDebito] = useState(true);
    const [arrow, setArrow] = useState('');

    const styles = StyleSheet.create({
        
        credit: {
            color: Colors.WHITE,
        },
        debit: {
            color: '#FC6D6D',
        },
    });

    const onPressButton = ()=> {
        setToggle(!toggle);
      };

      async function getEvent(idEvent){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/event/${idEvent}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                if(jsonResponse.message.name.length > 23){
                    setEvent(jsonResponse.message.name.slice(0,20)+'...');
                }else{
                    setEvent(jsonResponse.message.name);
                }
                
            }
        }     
    };
      useEffect(() => {
        getEvent(payment.event_id)
        if(payment.paymentAmount >= 0){
            setDebito(false);

        }else{
            setDebito(true);
            
        }
        
        
      }, [])
      
  return (
    //height:`${toggle ? 30:10}%`
        <TouchableHighlight style={{width:'90%' , backgroundColor: Colors.PRIMARY_DARK_GRAYED  , borderRadius:10 , marginBottom:10}} onPress={ onPressButton}>
            
            <View style= {{padding:10 , justifyContent:'center'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between' }}>
                
                
                
            
            <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize:19,verticalAlign:'top', textAlign:'left'}}><Ionicons name={debito?"arrow-back-outline":'arrow-forward-outline'} color={debito?'#FC6D6D':Colors.WHITE} size={20} />&nbsp;{event}</Text>
                
            
            <Text style={[{ fontWeight: 'bold', fontSize:20,textAlign:'right', borderRadius:10,color:Colors.WHITE}]}>{debito ?   `- $${Math.abs(payment.paymentAmount)}`:`$${payment.paymentAmount}` }</Text>
            </View>
            
            {toggle ? 
            <View style= {{padding:10 }}>
                {debito ? 
                    <>
                    <Text style={{ fontWeight: 'normal', color: Colors.WHITE,  fontSize:18}}>Pagado con tarjeta:&nbsp;
                    <Text style={{fontWeight:'bold'}}> **** {payment.numberCard? payment.numberCard.slice(-4): '3241'}</Text>   
                    </Text>
                    <Text style={{fontWeight:'normal', fontStyle:'italic', color: Colors.WHITE,  fontSize:18}}>Medio de Pago:&nbsp;
                        <Text style={{fontWeight:'bold'}}>{payment.typeOfCard == 'debit' ?'Débito':'Credito'
                    }</Text>
                </Text>
                    </>
                    
                    :<></>}
                
                <Text style={{ fontWeight: 'normal', color: Colors.WHITE,  fontSize:16}}>
                    <Text>Fecha de pago: </Text>
                    <Text style={{fontWeight:'bold'}}>{payment.date}
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
