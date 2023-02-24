import { useEffect, useState } from "react";
import { PaymentCard } from "./PaymentCard";
import { Image, Text, TouchableHighlight, View, ScrollView ,RefreshControl} from 'react-native';
import AppConstants from '../constants/AppConstants';
import ScreenTitle from "./ScreenTitle";
import Colors from "../constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import  ScreenSubtitle  from "./ScreenSubtitle";

export const SaldoCard = ({userId}) => {
    const [saldo, setSaldo] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    async function getSaldo(userId){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/users?email=${userId}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            
                setSaldo(JSON.stringify(jsonResponse));
                setSaldo(jsonResponse[0].money);
            
        }else{
            setSaldo(-1);
        }    
    }
  
  
    useEffect( () => {
        getSaldo(userId);
  
    }, []);

  return (
    <View style={{alignItems: 'center'}}>
        <ScreenSubtitle title='Saldo'></ScreenSubtitle>
        <View style={{  width:'60%', backgroundColor: Colors.PRIMARY_DARK_GRAYED  ,margin:20, borderRadius:10 , alignItems:'center'}}>
            <Text style={{padding:10}}>
            <Ionicons name="wallet"  color={Colors.PRIMARY} size={25}></Ionicons>
            <Text style={{fontSize:25 ,fontWeight:'bold', color:Colors.WHITE}}>&nbsp;${saldo}</Text>
            </Text>
        
        </View>
        
    </View>
    
  )
}
