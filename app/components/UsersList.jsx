import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { UserCard } from './UserCard';
import Colors from '../constants/Colors';
import AppConstants from '../constants/AppConstants';


export const UsersList = ({usuarios}) => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    setUsers(usuarios)
  }, [usuarios])
  
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 15 }}>
      {
      usuarios.length > 0 ?
      usuarios.map(user => <UserCard key={'person-card-' + user.id} persona={user}></UserCard>)
      :
      <></>
      }
{/*     
        {
        users.length > 0 ?
        users.map(e => <UserCard></UserCard>)
        :
        <View style={{alignItems: 'center', borderWidth:5, borderRadius:10, borderColor: Colors.PRIMARY_VERY_DARK_GRAYED, padding:10}}>
            <Text style={{fontSize: 20, color:"white", marginTop: 10}}>No se encontraron usuarios...</Text>
        </View>
        } */}
    </ScrollView>
    
  )
}
