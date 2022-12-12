import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';
import ScreenTitle from '../components/ScreenTitle';
import Colors from '../constants/Colors';
import { useGlobalAuthActionsContext, useGlobalAuthContext } from '../utils/ContextFactory';
import Session from '../utils/Session';

export default function SettingsScreen({ route, navigaton }) {
    const appAuthContext = useGlobalAuthContext();
    const setAppAuthContext = useGlobalAuthActionsContext();

    const closeSession = () => {
        appAuthContext.userSession.logOut()
        .then(sessionClosed => setAppAuthContext({
            userSession: Session.getInstance(),
            favorites: []
        }))
    }

    return (
        <View style={{ width: '100%', paddingTop: 50, height: '100%', backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED, alignContent: 'center' }}>
            <ScreenTitle title="Configuracion" />
            <Button title="Cerrar sesion" type="large" titleSize={18} onPress={closeSession} />
        </View>
    )
}