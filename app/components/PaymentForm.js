import { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, Text } from "react-native"
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from './Button';
import MaskInput from 'react-native-mask-input';
import { Picker } from "@react-native-picker/picker";


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


export default function PaymentForm () {

    const fontSize = 14;


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

    const [stateForm, setStateForm] = useState({
        cardHolderName: "",
        cardType: "debit",
        cardNumber: {"masked":"", "unmasked":""},
        expireDate: {"masked":"", "unmasked":""},
        cvv: {"masked":"", "unmasked": ""}
    });


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
                            let month = parseInt(masked.split("/")[0]);
                            let year = "";
                            if(masked.split("/").length > 1){
                                year = masked.split("/")[1];
                            }
                            if (month > 12) month = 12;
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
                <Button title="FINALIZAR COMPRA" titleStyle={{paddingRight: 20, left: -10}} onPress={() => console.log("SUBMITEE")}/>
                <View style={{ justifyContent: 'center', position: 'absolute', right: 10, alignContent: 'center' }}>
                        <Ionicons name={"wallet-outline"} color={Colors.BLACK} size={35} style={{marginTop:15}} />
                </View>
            </View>
        </View>
    );
}