import React, { useState } from 'react';
import { KeyboardAvoidingView, Image, Text, View, Alert, ScrollView } from 'react-native';
import EventifyTextInput from '../components/EventifyTextInput';
import Colors from '../constants/Colors';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../components/Button';
import { useGlobalAuthActionsContext, useGlobalAuthContext } from '../utils/ContextFactory';
import { login } from '../utils/NetworkAPI';
import ValidationUtils from '../utils/ValidationUtils';

const EventifyLogo = require('../assets/eventify-logo.png');

export default function LoginScreen({ route, navigation }) {
    const appAuthContext = useGlobalAuthContext();
    const setAppAuthContext = useGlobalAuthActionsContext();

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [loading, setLoading] = useState(false);

    const tryLogin = () => {
        if (emailInput == "" || passwordInput == "") {
            return Alert.alert('Completa los datos por favor');
        }

        if (loading) {
            return;
        }

        setLoading(true);

        login(emailInput, passwordInput)
        .then(loginResponse => {
            if (ValidationUtils.isEmpty(loginResponse.status_code)) {
                appAuthContext.userSession.logIn(loginResponse.user)
                .then(sessionInitialized => {
                    if (sessionInitialized) {
                        setAppAuthContext((prevState) => ({
							...prevState,
							userSession: appAuthContext.userSession
						}));
                    }
                })
            }
            else {
                Alert.alert(
                    'Error iniciando sesion',
                    !ValidationUtils.isEmpty(loginResponse.detail) ? loginResponse.detail : 'Hubo un error intentando iniciar sesion',
                    [{ text: 'Entendido' }]
                );
            }
        })
        .catch(e => {
            console.log(e);
            Alert.alert(
                'Error iniciando sesion',
                'Hubo un error intentando iniciar sesion',
                [{ text: 'Entendido' }]
            );
        })
        .finally(() => setLoading(false));
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
                <View style={{ flex: 6, backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, paddingVertical: 20, paddingHorizontal: 15 }}>
                    <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 40, marginBottom: 10 }}>Bienvenido</Text>
                    <Text style={{ color: Colors.GRAY, fontSize: 20 }}>Ingresa tus datos para continuar</Text>

                    <View style={{ backgroundColor: Colors.PRIMARY_DARK_GRAYED, borderRadius: 20, padding: 15, paddingBottom: 0, marginTop: 20 }}>
                        <EventifyTextInput value={emailInput} onChangeText={setEmailInput} name="Correo electronico" autoCapitalize={false} leftIcon={<Fontisto name="email" color={Colors.GRAY} size={23} />} inputTextColor={Colors.GRAY} fontSize={23} placeholderTextColor={Colors.GRAY} keyboardType="email-address" />
                        <EventifyTextInput value={passwordInput} onChangeText={setPasswordInput} name="Clave" autoCapitalize={false} leftIcon={<Ionicons name="md-key-outline" color={Colors.GRAY} size={23} />} inputTextColor={Colors.GRAY} fontSize={23} placeholderTextColor={Colors.GRAY} isPassword={true} />
                        <View style={{ width: '100%', height: 30 }}>
                            <Button disabled={loading} onPress={tryLogin} buttonStyle={{ alignSelf: 'center', position: 'absolute', top: -10 }} title={loading ? "INGRESANDO..." : "INGRESAR"} type="medium" titleSize={25} titleColor={Colors.WHITE} color={Colors.PRIMARY} />
                        </View>
                    </View>

                <View style={{ width: '100%', alignItems: 'center', marginTop: 70 }}>
                        <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 23, marginBottom: 40 }}>Olvidaste tu clave?</Text>
                        <Text style={{ color: Colors.PRIMARY_GRAYED, fontSize: 20, marginBottom: 15 }}>Aun no estas registrado?</Text>
                        <Text onPress={() => { !loading && navigation.navigate("Register");}} style={{ color: Colors.PRIMARY_VERY_LIGHT, fontWeight: 'bold', fontSize: 26 }} >Registrate</Text>
                </View>
                </View>
            
            </KeyboardAvoidingView>
        </ScrollView>
    )
}