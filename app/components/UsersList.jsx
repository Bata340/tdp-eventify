import React from 'react'
import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { UserCard } from './UserCard';
import Colors from '../constants/Colors';
import AppConstants from '../constants/AppConstants';
export const UsersList = ({usuarios = [] , onClick , icon }) => {


  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 30 }}>
        {
        usuarios.length > 0 ?
            usuarios.map(e => <UserCard key={'event-card-' + e.id+'-'+e._id}  persona={e} onClick={onClick}  icono={icon}/>)
        :
        <View style={{alignItems: 'center', borderWidth:5, borderRadius:10, borderColor: Colors.PRIMARY_VERY_DARK_GRAYED, padding:10}}>
            <Text style={{fontSize: 20, color:"white", marginTop: 10}}>No se encontraron usuarios...</Text>
        </View>
        }
    </ScrollView>
    
  )
}
