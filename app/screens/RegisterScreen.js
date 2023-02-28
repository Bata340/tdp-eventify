import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Image, View, Alert, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import EventifyTextInput from '../components/EventifyTextInput';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppConstants from '../constants/AppConstants';
import { uploadImageToStorageWithURI } from '../utils/FirebaseHandler';
import { useNavigation, StackActions}  from '@react-navigation/native';

const EventifyLogo = require('../assets/eventify-logo.png');

export default function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [alreadyUploaded, setalreadyUploaded] = useState(false);
  
  const [loading, setLoading] = useState(false);

  async function tryRegister () {
    setLoading(true);
    if (name == "" || email == "" || password == "" || passwordCheck == "") {
        setLoading(false);
        return Alert.alert('Completa los datos por favor');
    }

    if (password != passwordCheck) {
        setLoading(false);
        return Alert.alert('Las contraseñas ingresadas no coinciden');
    }

    let nameImage = "";
    if(!alreadyUploaded){
        if (profilePic){
            nameImage = profilePic.uri.split('/')[profilePic.uri.split('/').length - 1];
            nameImage = await uploadImageToStorageWithURI(nameImage, profilePic.uri);
        }
    }else{
        if (profilePic){
            nameImage = profilePic.name;
        }
    }

    const paramsPost = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
            "name": name,
            "password": password,
            "email": email,
            "birth_date": (dateOfBirth.getFullYear()) + "-" +
                         ((dateOfBirth.getMonth()+1).toString().padStart(2, '0')) + "-" + 
                           dateOfBirth.getDate().toString().padStart(2, '0'),
            "money": 0,
            "profilePic": nameImage
        })
    };

    const url = `${AppConstants.API_URL}/register`;
    
    const response = await fetch(
        url,
        paramsPost
    );

    const jsonResponse = await response.json();

    if (response.status === 200){
        setLoading(false);
        if(!jsonResponse.status_code){
            Alert.alert(
                "Usuario creado correctamente", 
                "Su usuario ha sido creado correctamente. Al cerrar este diálogo será redireccionado al Login.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.dispatch(StackActions.pop(1))
                    }
                ]
            );
        }else{
            if(jsonResponse.status_code){
                Alert.alert("Error al crear el usuario", jsonResponse.detail);
            }
            Alert.alert("Error al crear el usuario", "Ocurrio un error al intentar crear su perfil. Vuelva a intentarlo más tarde.");
        }
    }else{
        setLoading(false);
        Alert.alert("Error al crear el usuario", "Ocurrio un error al intentar crear su perfil. Vuelva a intentarlo más tarde.");
    }

    
  };

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
        setProfilePic(res.assets[0])
    }
  }

  return (
    <ScrollView>
        <KeyboardAvoidingView 
            style={{ width: '100%', height: '100%', alignContent: 'center', display: 'flex' }}
            behavior="padding"
        >
            <View style={{ flex: 4, backgroundColor: Colors.PRIMARY_DARKER, alignItems: 'center', justifyContent: 'center', paddingBottom: 20, paddingTop:40 }}>
                <Image source={EventifyLogo} style={{ height: 150, resizeMode: 'contain' }} />
            </View>
            <View style={{ backgroundColor: Colors.PRIMARY_DARK_GRAYED, borderRadius: 0, padding: 15, paddingBottom: '100%', marginTop: 0 }}>
                <EventifyTextInput value={name} onChangeText={setName} name="Nombre completo" autoCapitalize={false} leftIcon={<Ionicons name="person" color={Colors.GRAY} size={23} />} inputTextColor={Colors.GRAY} fontSize={23} placeholderTextColor={Colors.GRAY} />
                <EventifyTextInput value={email} onChangeText={setEmail} name="Correo electronico" autoCapitalize={false} leftIcon={<Fontisto name="email" color={Colors.GRAY} size={23} />} inputTextColor={Colors.GRAY} fontSize={23} placeholderTextColor={Colors.GRAY} keyboardType="email-address" />
                <EventifyTextInput value={password} onChangeText={setPassword} name="Clave" autoCapitalize={false} leftIcon={<Ionicons name="md-key-outline" color={Colors.GRAY} size={23} />} inputTextColor={Colors.GRAY} fontSize={23} placeholderTextColor={Colors.GRAY} isPassword={true} />     
                <EventifyTextInput value={passwordCheck} onChangeText={setPasswordCheck} name="Repetir clave" autoCapitalize={false} leftIcon={<Ionicons name="md-key-outline" color={Colors.GRAY} size={23} />} inputTextColor={Colors.GRAY} fontSize={23} placeholderTextColor={Colors.GRAY} isPassword={true} />     
                <EventifyTextInput value={selectedDate ? dateOfBirth.getDate().toString().padStart(2, '0')+"-"+((dateOfBirth.getMonth()+1).toString().padStart(2, '0'))+"-"+(dateOfBirth.getFullYear()): ''} onPressIn={()=>setShowDatePicker(true)} name="Fecha de Nacimiento" autoCapitalize={false} leftIcon={<Ionicons name="calendar" color={Colors.GRAY} size={23} />} inputTextColor={Colors.GRAY} fontSize={23} placeholderTextColor={Colors.GRAY} />
                {
                    showDatePicker ?
                        <DateTimePicker value={dateOfBirth} onChange={(event) => {
                            setDateOfBirth(new Date(event.nativeEvent.timestamp));
                            setShowDatePicker(false);
                            setSelectedDate(true);
                        }}
                        placeholder="Fecha de nacimiento" mode="date" caretHidden={true} maximumDate={new Date()}
                    /> 
                    : null
                }            
            <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.PRIMARY_DARK_GRAYED, paddingBottom: 50}}>
                <TouchableOpacity 
                    style={{backgroundColor: Colors.PRIMARY_DARK, color: Colors.WHITE, width: "80%", marginTop: 20, borderRadius:20, padding: 10, fontSize: 14, alignItems:"center", justifyContent:"center", borderStyle: "dashed", borderWidth: 1, borderColor: Colors.WHITE, overflow:"hidden"}}
                    onPress={handleGallery}
                >
                {
                    profilePic ?
                        <Image style = {{width: '100%', height: undefined, aspectRatio: 16/9,}}
                            source = {alreadyUploaded ? {uri: profilePic.uri} : profilePic}
                        />
                    :  
                        <>
                            <Ionicons color={Colors.WHITE} size={35} name={"image-outline"}/>
                            <Text style={{color: "white", textAlign: "center", fontWeight: "bold"}}> Sube una foto de perfil </Text>
                        </>
                }
                </TouchableOpacity>
            </View>
                <View style={{ width: '100%', height: '1000%' }}>
                    {
                    loading ?  <ActivityIndicator size="large" color="#00ff00" /> :
                    <Button onPress={tryRegister} buttonStyle={{ alignSelf: 'center', position: 'absolute', top: -10 }} title="INGRESAR" type="medium" titleSize={25} titleColor={Colors.WHITE} color={Colors.PRIMARY} />
                    }
                </View>
            </View>
        </KeyboardAvoidingView>
    </ScrollView>
  )
}

/*<DateTimePicker value={dateOfBirth} onDateChange={setDateOfBirth} placeholder="Fecha y hora..." mode="date" minimumDate={new Date()}/>*/