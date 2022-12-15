import { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet } from "react-native"
import Colors from '../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from './Button';


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
            paddingBottom: 20
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
        maxAvaiability: "",
        showHourPicker: false,
        showDatePicker: false,
    });

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={stateForm.name}
                    onChange={(event)=>setStateForm({...stateForm, name: event.target.value})}
                    placeholder="Nombre del evento..."
                />
            </View>
            <View style={{...styles.inputContainer, ...styles.iconInputContainer}}>
                
                <TextInput
                    style={styles.textInput}
                    value={stateForm.price.toString()}
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
                        value={stateForm.eventDate.getDate()+"/"+(stateForm.eventDate.getMonth()+1)+"/"+(stateForm.eventDate.getFullYear())}
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
                        /> : null
                    }
                </View>
            </View>
            <View style={{...styles.inputContainer, ...styles.iconInputContainer}}>
                <TextInput
                    style={styles.textInput}
                    value={stateForm.location}
                    onChange={(event)=>setStateForm({...stateForm, location: event.target.value})}
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
                    onChange={(event)=>setStateForm({...stateForm, description: event.target.value})}
                    placeholder="Descripción..."
                    multiline = {true}
                    numberOfLines = {4}
                />
            </View>
            <View style={{marginTop: 20}}>
            <Button title="Submit" onPress={() => console.log("SUBMITEE")}/>
            </View>
        </View>
    );
}