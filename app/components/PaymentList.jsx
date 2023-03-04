import { useEffect, useState } from "react";
import { PaymentCard } from "./PaymentCard";
import { Image, Text, TouchableHighlight, View, ScrollView ,RefreshControl} from 'react-native';
import AppConstants from '../constants/AppConstants';
import ScreenTitle from "./ScreenTitle";
import Colors from "../constants/Colors";
import ScreenSubtitle from "./ScreenSubtitle";
import { useGlobalAuthContext } from "../utils/ContextFactory";

const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const PaymentList = (user) => {
    const [payments, setPayments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const appAuthContext = useGlobalAuthContext();
    const userEmail = appAuthContext.userSession.getUserEmail();

    async function getPayments(){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/transactions/${userEmail}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayPayments = [];
                for(let i=0; i<jsonResponse.length; i++){
                    console.log(jsonResponse[i].date);
                    const date = new Date(jsonResponse[i].date);
                    
                    arrayPayments.push({
                        _id: jsonResponse[i]._id.$oid,
                        event_id: jsonResponse[i].event_id,
                        userId: jsonResponse[i].userId,
                        date: `${date.getDate().toString().padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`,
                        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
                        typeOfCard: jsonResponse[i].typeOfCard,
                        paymentAmount: jsonResponse[i].paymentAmount,
                        numberCard: jsonResponse[i].numberCard,
                        
                    });
                }
                setPayments(arrayPayments);
            }
        }     
    }
  
  
    useEffect( () => {
        getPayments();
  
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getPayments();
        setRefreshing(false);
      };
  return (
    <><ScrollView
                    contentContainerStyle={{ alignItems: 'center', paddingTop: 30 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} 
                          onRefresh={onRefresh} />
                    }
                >
                    <ScreenSubtitle title="Últimos Movimientos"></ScreenSubtitle>
                    {
                    
                    payments.length > 0 ?
                    payments.map(e => <PaymentCard key={'payment-card-' + '-'+e._id} payment={e} />)
                    :
                    <View style={{alignItems: 'center', borderWidth:5, borderRadius:10, borderColor: Colors.PRIMARY_VERY_DARK_GRAYED, padding:10}}>
                        
                        <Text style={{fontSize: 20, color:"white", marginTop: 10}}>Aún no posees pagos... </Text>
                    </View>
                    }
                    <View style={{ height: 230 }}></View>
                </ScrollView>
    </>
  )
}
