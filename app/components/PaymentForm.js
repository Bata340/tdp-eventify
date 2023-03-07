import { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, Text, ActivityIndicator, Alert } from "react-native"
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from './Button';
import MaskInput from 'react-native-mask-input';
import { Picker } from "@react-native-picker/picker";
import AppConstants from '../constants/AppConstants';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useGlobalAuthContext } from '../utils/ContextFactory';


const cardTypes = [
    {
        "name": "Débito",
        "value": "debit",
    },
    {
        "name": "Crédito",
        "value": "credit",
    }
];

const maskCVV = [ /\d/, /\d/, /\d/ ];
const maskCard = [ /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/ ];
const maskExpire = [ /\d/, /\d/, '/', /\d/, /\d/ ];

const creditCard = getRandomInt(1000,9999);

const mesCard= getRandomInt(10,13);
const anioCard = getRandomInt(24,30);
const initialState = {
    cardHolderName: "",
    cardType: "debit",
    cardNumber: {"masked":"4517 6179 5235 "+creditCard , "unmasked":"451761795235"+creditCard},
    expireDate: {"masked":`${mesCard}/${anioCard}`, "unmasked":`${mesCard}${anioCard}`},
    cvv: {"masked":"", "unmasked": ""}
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
export default function PaymentForm ( { event } ) {

    const fontSize = 14;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const appAuthContext = useGlobalAuthContext();

    const userEmail = appAuthContext.userSession.getUserEmail();
    const userName = appAuthContext.userSession.getUserFullName();
    
    

    const styles = StyleSheet.create({
        textInput: {
            color: "black",
            fontSize: fontSize
        },
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED,
            paddingBottom: 100
        },
        inputContainer: {
            backgroundColor: Colors.PRIMARY_VERY_LIGHT,
            color: Colors.BLACK,
            width: "80%",
            marginTop: 20,
            borderRadius:20,
            padding: 10,
            fontSize: fontSize
        },
        iconInputContainer: { 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center'
        }
    });

    const [stateForm, setStateForm] = useState({...initialState ,cardHolderName:userName});


    const clearForm = () => {
        setStateForm(initialState);
    }


    const handleFinish = () => {
        clearForm();
        navigation.pop();
    }


    const validateForm = () => {
        let valid = true;
        if(stateForm.cardHolderName === "" || stateForm.cardNumber.unmasked === "" || stateForm.cardType === "" || stateForm.expireDate === "" || stateForm.cvv === ""){
            valid = false;
        }
        if(stateForm.cvv.unmasked.length < 3){
            valid = false;
        }
        if(stateForm.cardNumber.unmasked.length < 16){
            valid = false;
        }
        if(stateForm.expireDate.unmasked.length < 4){
            valid = false;
        }
        if(parseInt(stateForm.expireDate.unmasked.substr(2,2)) < parseInt(new Date().getFullYear().toString().substr(2,2))){
            valid = false;
        }
        return valid;
    }


    const submitPayment = async () => {
        const userId = userEmail;
        setLoading(true);
        if(validateForm()){
            const paramsPost = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: userId, 
                    dateReserved: event.isoStringDate,
                    typeOfCard: stateForm.cardType,
                    numberCard: stateForm.cardNumber.unmasked
                })
            };
            const url = `${AppConstants.API_URL}/event/reserve/${event._id}`;
            const response = await fetch(
                url,
                paramsPost
            );
            const jsonResponse = await response.json();
            if (response.status === 200){
                setLoading(false);
                if(!jsonResponse.status_code){
                    Alert.alert(
                        "Reserva Registrada", 
                        "Su pago ha sido efectuado correctamente. Al cerrar este diálogo será redireccionado a la página principal y podrá encontrar su ticket dentro de \"Mis Eventos\".",
                        [
                            {
                                text: "OK",
                                onPress: () => handleFinish()
                            }
                        ]
                    );
                }else{
                    Alert.alert("Error en la compra", "Ocurrio un error al intentar comprar su ticket. Vuelva a intentarlo más tarde.");
                }
            }else{
                setLoading(false);
                Alert.alert("Error en la compra", "Ocurrio un error al intentar comprar su ticket. Vuelva a intentarlo más tarde.");
            }
        }else{
            setLoading(false);
            Alert.alert("Campos Faltantes", "Aún hay campos faltantes o sin completar. Revise el formulario e intentelo de nuevo.")
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={{color: "black", fontWeight:"bold", borderBottomWidth:1}}>Tipo de Tarjeta:</Text>
                <Picker
                    
                    style={styles.textInput}
                    selectedValue={stateForm.cardType}
                    onValueChange={(itemValue, itemIndex)=>setStateForm({...stateForm, cardType: itemValue})}
                    placeholder="Tipo de Tarjeta..."
                >
                    {cardTypes.map((cardType) => {
                        return(
                            <Picker.Item key = {"key_"+cardType.value} label={cardType.name} value={cardType.value} />
                        )
                    })}
                </Picker>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={stateForm.cardHolderName}
                    onChange={(event)=>setStateForm({...stateForm, cardHolderName: event.target.value})}
                    placeholder="Nombre del portador..."
                />
                <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                    <Ionicons name={"people-outline"} color={Colors.BLACK} size={35} />
                </View>
            </View>
            <View style={{...styles.inputContainer, ...styles.iconInputContainer}}>
                
                <MaskInput
                    style={styles.textInput}
                    value={stateForm.cardNumber.masked}
                    onChangeText={(masked, unmasked)=> {setStateForm({...stateForm, cardNumber: {"masked": masked, "unmasked": unmasked}});}}
                    mask={maskCard}
                    keyboardType="numeric"
                    placeholder="Número de Tarjeta"
                />
                <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                    <Ionicons name={"card-outline"} color={Colors.BLACK} size={35} />
                </View>
            </View>
            <View style={{ width:"80%", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center" }}>
                <View style={{...styles.inputContainer, ...styles.iconInputContainer, marginRight:10, flex:1}}>
                    <MaskInput
                        value={stateForm.expireDate.masked}
                        onChangeText={(masked, unmasked) => {
                            let month;
                            if(masked.split("/")[0].length === 2){
                                if(masked.split("/")[0] === "00"){
                                    month = "01";
                                }else{
                                    month = parseInt(masked.split("/")[0]).toString().padStart(2, "0");
                                }
                            }else{
                                month = parseInt(masked.split("/")[0]);
                            }
                            let year = "";
                            if(masked.split("/").length > 1){
                                year = masked.split("/")[1];
                            }
                            if (parseInt(masked.split("/")[0]) > 12) month = 12;
                            if (year != ""){
                                masked = `${month.toString()}/${year.toString()}`;
                                unmasked = month.toString()+year.toString();
                            }else{
                                masked = month.toString();
                                unmasked = month.toString();
                            }
                            setStateForm({...stateForm, expireDate: {"masked": masked, "unmasked":unmasked}})
                        }}
                        keyboardType="numeric"
                        placeholder="Vencimiento"
                        mask={maskExpire}
                        style={styles.textInput}
                    />
                    <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                        <Ionicons name={"calendar-outline"} color={Colors.BLACK} size={25} />
                    </View>
                </View>
                <View style={{...styles.inputContainer, ...styles.iconInputContainer, flex:1}}>
                    <MaskInput
                        value={stateForm.cvv.masked}
                        keyboardType="numeric"
                        placeholder="CVV"
                        style={styles.textInput}
                        mask={maskCVV}
                        onChangeText={(masked, unmasked) => setStateForm({...stateForm, cvv: {"masked":masked, "unmasked": unmasked}})}
                    />
                </View>
            </View>
            <View style={{marginTop: 20}}>
                {
                loading 
                ? 
                    <ActivityIndicator size="large" color="#00ff00" />
                :
                    <>
                        <Button title="FINALIZAR COMPRA" titleStyle={{paddingRight: 20, left: -10}} onPress={() => submitPayment()}/>
                        <View style={{ justifyContent: 'center', position: 'absolute', right: 10, alignContent: 'center' }}>
                            <Ionicons name={"wallet-outline"} color={Colors.BLACK} size={35} style={{marginTop:15}} />
                        </View>
                    </>
                }
                
            </View>
        </View>
    );
}