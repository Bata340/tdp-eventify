import { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native"
import Colors from '../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from './Button';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from "@react-native-picker/picker";
import { uploadImageToStorageWithURI } from '../utils/FirebaseHandler';
import AppConstants from '../constants/AppConstants';


const categories = [
    {
        "name": "Recital",
        "value": "recital",
    },
    {
        "name": "Cine",
        "value": "cine",
    },
    {
        "name": "Boliche",
        "value": "boliche",
    },
    {
        "name": "Teatro",
        "value": "teatro",
    },
    {
        "name": "Evento Privado",
        "value": "evento_privado",
    },
    {
        "name": "Otro...",
        "value": "otro",
    }
];


export default function EventForm ({
    getPrevData = false
}) {

    const fontSize = 14;


    const styles = StyleSheet.create({
        textInput: {
            color: "white",
            fontSize: fontSize
        },
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.PRIMARY_VERY_DARK,
            paddingBottom: 100
        },
        inputContainer: {
            backgroundColor: Colors.PRIMARY_DARK,
            color: Colors.WHITE,
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
        name: "",
        price: "0.00",
        description: "",
        location: "",
        eventDate: new Date(),
        hour: "",
        showHourPicker: false,
        showDatePicker: false,
        eventImage: null,
        typeOfEvent: "recital",
        maxCapacity: "",
    });
    const [loading, setLoading] = useState(false);


    const handleGallery = async () => {
        const res = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            }
        );
        if (!res.canceled) {
            setStateForm({...stateForm, eventImage: res.assets[0]});
        }
    }


    const validateForm = () => {
        let valid = true;
        if(stateForm.name === "" || stateForm.name === undefined || stateForm.name === null){
            valid = false;
            Alert.alert("Nombre inválido", "Nombre inválido. Modifique el campo para poder continuar.");
        }
        try{
            if(parseFloat(stateForm.price) < 0){
                valid = false;
                Alert.alert("Precio inválido", "El precio no puede ser menor a 0. Verifique el mismo dentro del formulario.");
            }
        }catch(exc){
            valid = false;
            Alert.alert("Precio inválido", "El precio del evento es inválido. Verifique el mismo dentro del formulario.");
        }
        if(stateForm.description === "" || stateForm.description === undefined || stateForm.description === null){
            valid = false;
            Alert.alert("Descripción inválida", "La descripción dada para el evento es inválida. Modifique el campo para poder continuar.");
        }
        if(stateForm.location === "" || stateForm.location === undefined || stateForm.location === null){
            valid = false;
            Alert.alert("Ubicación inválida", "La ubicación definida inválida. Modifique el campo para poder continuar.");
        }
        if(stateForm.hour === "" || stateForm.hour === undefined || stateForm.hour === null){
            valid = false;
            Alert.alert("Hora inválida", "La Hora definida para el evento es inválida. Modifique el campo para poder continuar.");
        }
        if (stateForm.eventImage === "" || stateForm.eventImage === undefined || stateForm.eventImage === null){
            valid = false;
            Alert.alert("Imágen inválida", "La imágen definida para el evento es inválida. Modifique el campo para poder continuar.");
        }

        return valid;
    }


    const handleSubmit = async () => {
        const validForm = validateForm();
        if(!validForm){
            return;
        }
        
        setLoading(true);

        const nameImage = stateForm.eventImage.uri.split('/')[stateForm.eventImage.uri.split('/').length - 1];
        uploadImageToStorageWithURI(nameImage, stateForm.eventImage.uri);

        const timeZoneOffset = (-new Date().getTimezoneOffset()/60);
        const sign = timeZoneOffset/Math.abs(timeZoneOffset);
        const partialStringTZO = Math.abs(timeZoneOffset).toString().padStart(2, '0');
        const finalStringTZO = (sign == 1 ? '+' : '-') + partialStringTZO + ':00';
        const dateString = (stateForm.eventDate.getFullYear()+"-"+((stateForm.eventDate.getMonth()+1).toString().padStart(2, '0'))+"-"+stateForm.eventDate.getDate().toString().padStart(2, '0'));
        const paramsPost = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "key": stateForm.name+"_"+AppConstants.ASYNC_STORAGE_KEYS.LOGGED_USER,
                "name": stateForm.name,
                "owner": AppConstants.ASYNC_STORAGE_KEYS.LOGGED_USER,
                "price": parseFloat(stateForm.price),
                "description": stateForm.description,
                "location": stateForm.location,
                "score": 0,
                "maxAvailability": parseInt(stateForm.maxCapacity),
                "eventDates": [
                    `${dateString}T${stateForm.hour}:00.281000${finalStringTZO}`
                ],
                "photos": [
                    nameImage
                ],
                "paymentsReceived": []
            })
        };
        const url = `${AppConstants.API_URL}/event`;
        const response = await fetch(
            url,
            paramsPost
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            setLoading(false);
            if(!jsonResponse.status_code){
                
                Alert.alert("Evento creado correctamente", "Su evento ha sido creado correctamente. Al cerrar este diálogo será redireccionado a la página principal.");
            }else{
                Alert.alert("Error al crear el evento", "Ocurrio un error al intentar crear su evento. Vuelva a intentarlo más tarde.");
            }
        }else{
            Alert.alert("Error al crear el evento", "Ocurrio un error al intentar crear su evento. Vuelva a intentarlo más tarde.");
        }
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={{...styles.inputContainer, alignItems:"center", justifyContent:"center", borderStyle: "dashed", borderWidth: 1, borderColor: Colors.WHITE, overflow:"hidden"}}
                onPress={handleGallery}
            >
                {
                stateForm.eventImage ?
                    <Image
                        style = {{
                            width: '100%',
                            height: undefined,
                            aspectRatio: 16/9,
                        }}
                        source = {stateForm.eventImage}
                    />
                :  
                    <>
                        <Ionicons color={Colors.WHITE} size={35} name={"image-outline"}/>
                        <Text style={{color: "white", textAlign: "center", fontWeight: "bold"}}>
                            Presiona para subir una imagen...
                        </Text>
                    </>
                }
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <Text style={{color: "black", fontWeight:"bold", borderBottomWidth:1}}>Categoría del evento:</Text>
                <Picker
                    style={styles.textInput}
                    selectedValue={stateForm.typeOfEvent}
                    onValueChange={(itemValue, itemIndex)=>setStateForm({...stateForm, typeOfEvent: itemValue})}
                    placeholder="Categoria"
                >
                    {categories.map((category) => {
                        return(
                            <Picker.Item key = {"key_"+category.value} label={category.name} value={category.value} />
                        )
                    })}
                </Picker>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={stateForm.name}
                    onChangeText={(event)=>setStateForm({...stateForm, name: event})}
                    placeholder="Nombre del evento..."
                />
            </View>
            <View style={{...styles.inputContainer, ...styles.iconInputContainer}}>
                
                <TextInput
                    style={styles.textInput}
                    value={stateForm.maxCapacity > 0 ? stateForm.maxCapacity.toString(): ""}
                    onChangeText={(text)=> {setStateForm({...stateForm, maxCapacity: Math.floor(text)});}}
                    keyboardType="numeric"
                    placeholder="Capacidad Máxima... (Opcional)"
                />
                <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                    <Ionicons name={"people-outline"} color={Colors.BLACK} size={35} />
                </View>
            </View>
            <View style={{...styles.inputContainer, ...styles.iconInputContainer}}>
                
                <TextInput
                    style={styles.textInput}
                    value={stateForm.price > 0 ? stateForm.price.toString() : ""}
                    onChange={(event)=> setStateForm({...stateForm, price: parseFloat(event.nativeEvent.text).toFixed(2).toString()})}
                    keyboardType="numeric"
                    placeholder="Precio..."
                />
                <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                    <Ionicons name={"cash"} color={Colors.BLACK} size={35} />
                </View>
            </View>
            <View style={{ width:"80%", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center" }}>
                <View style={{...styles.inputContainer, ...styles.iconInputContainer, marginRight:10, flex:1}}>
                    <TextInput
                        value={stateForm.eventDate.getDate().toString().padStart(2, '0')+"/"+((stateForm.eventDate.getMonth()+1).toString().padStart(2, '0'))+"/"+(stateForm.eventDate.getFullYear())}
                        onPressIn={(event)=>setStateForm({...stateForm, showDatePicker: true})}
                        placeholder="Fecha..."
                        caretHidden={true}
                        style={styles.textInput}
                    />
                    <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                        <Ionicons name={"calendar"} color={Colors.BLACK} size={35} />
                    </View>
                    {
                        stateForm.showDatePicker ?
                        <DateTimePicker
                            value={stateForm.eventDate}
                            onChange={(event) => setStateForm({...stateForm, eventDate: new Date(event.nativeEvent.timestamp), showDatePicker: false})}
                            placeholder="Fecha y hora..."
                            mode="date"
                            minimumDate={new Date()}
                        /> : null
                    }
                </View>
                <View style={{...styles.inputContainer, ...styles.iconInputContainer, flex:1}}>
                    <TextInput
                        style={styles.textInput}
                        value={stateForm.hour}
                        placeholder="Hora..."
                        caretHidden={true}
                        onPressIn={() => setStateForm({...stateForm, showHourPicker: true})}
                    />
                    
                    <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                        <Ionicons name={"time"} color={Colors.BLACK} size={35} />
                    </View>
                    {
                        stateForm.showHourPicker ?
                        <DateTimePicker
                            value={stateForm.eventDate}
                            onChange={(event) => setStateForm({...stateForm, hour: new Date(event.nativeEvent.timestamp).toLocaleTimeString().substr(0,5), showHourPicker: false})}
                            placeholder="Fecha y hora..."
                            mode="time"
                            minimumDate={new Date()}
                        /> : null
                    }
                </View>
            </View>
            <View style={{...styles.inputContainer, ...styles.iconInputContainer}}>
                <TextInput
                    style={styles.textInput}
                    value={stateForm.location}
                    onChangeText={(event)=>setStateForm({...stateForm, location: event})}
                    placeholder="Ubicación..."
                />
                <View style={{ justifyContent: 'center', position: 'absolute', right: 15, alignContent: 'center' }}>
                    <Ionicons name={"location"} color={Colors.BLACK} size={35} />
                </View>
            </View>
            <View style = {styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={stateForm.description}
                    onChangeText={(event)=>setStateForm({...stateForm, description: event})}
                    placeholder="Descripción..."
                    multiline = {true}
                    numberOfLines = {4}
                />
            </View>
            <View style={{marginTop: 20}}>
                {loading ? <ActivityIndicator size="large" color="#00ff00" /> :<Button title="Submit" onPress={() => handleSubmit()}/>}
            </View>
        </View>
    );
}