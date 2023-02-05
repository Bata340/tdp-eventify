import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Image, View, Alert } from 'react-native';
import Colors from '../constants/Colors';
import EventifyTextInput from '../components/EventifyTextInput';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
const EventifyLogo = require('../assets/eventify-logo.png');

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');


  const tryRegister = () => {
    if (name == "" || email == "" || password == "" || passwordCheck == "") {
        return Alert.alert('Completa los datos por favor');
    }

    if (password != passwordCheck) {
        return Alert.alert('Las contraseñas ingresadas no coinciden');
    }

    // Implementar la lógica para crear un nuevo usuario en la base de datos
    // ...

    navigation.navigate('Login');
  };

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
                <View style={{ width: '100%', height: '1000%' }}>
                    <Button onPress={tryRegister} buttonStyle={{ alignSelf: 'center', position: 'absolute', top: -10 }} title="INGRESAR" type="medium" titleSize={25} titleColor={Colors.WHITE} color={Colors.PRIMARY} />
                </View>
            </View>
        </KeyboardAvoidingView>
    </ScrollView>
  )
}

