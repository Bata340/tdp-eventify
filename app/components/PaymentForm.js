import { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image } from "react-native"
import Colors from '../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from './Button';
import * as ImagePicker from 'expo-image-picker';
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


export default function PaymentForm ({
    getPrevData = false
}) {

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
        cardNumber: "",
        expireDate: "",
        cvv: ""
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
                            <Picker.Item label={cardType.name} value={cardType.value} />
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
                
                <TextInput
                    style={styles.textInput}
                    value={stateForm.maxCapacity > 0 ? stateForm.maxCapacity.toString(): ""}
                    onChangeText={(text)=> {setStateForm({...stateForm, maxCapacity: Math.floor(text)});}}
                    keyboardType="numeric"
                    placeholder="Número de Tarjeta"
                />
                <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                    <Ionicons name={"card-outline"} color={Colors.BLACK} size={35} />
                </View>
            </View>
            <View style={{ width:"80%", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center" }}>
                <View style={{...styles.inputContainer, ...styles.iconInputContainer, marginRight:10, flex:1}}>
                    <TextInput
                        value={stateForm.expireDate}
                        onChange={(event) => setStateForm({...stateForm, expireDate: event.nativeEvent.text})}
                        keyboardType="numeric"
                        placeholder="Vencimiento"
                        style={styles.textInput}
                    />
                    <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                        <Ionicons name={"calendar-outline"} color={Colors.BLACK} size={25} />
                    </View>
                </View>
                <View style={{...styles.inputContainer, ...styles.iconInputContainer, flex:1}}>
                    <TextInput
                        style={styles.textInput}
                        value={stateForm.cvv}
                        keyboardType="numeric"
                        placeholder="CVV"
                        onChange={(event) => setStateForm({...stateForm, cvv: event.nativeEvent.text})}
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