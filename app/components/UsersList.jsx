import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { UserCard } from './UserCard';
import Colors from '../constants/Colors';


export const UsersList = ({route, usuarios, showButtons = true}) => {
  const [users, setUsers] = useState([]);
  const [showButtonsState, setShowButtonsState] = useState(true);

  useEffect(() => {
    if( ( usuarios && showButtons != undefined) || route ){
      setUsers(usuarios ? usuarios : (route.params.usuarios ? route.params.usuarios : null));
      setShowButtonsState(showButtons ? showButtons : (route.params.showButtons ? route.params.showButtons : null));
    }

  }, [usuarios, route]);
  
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 15 }}>
      {
      users.length > 0 ?
      users.map(user => <UserCard key={'person-card-' + user.id} persona={user} showButtons={showButtonsState}></UserCard>)
      :
        <View style={{alignItems: 'center', borderWidth:5, borderRadius:10, borderColor: Colors.PRIMARY_VERY_DARK_GRAYED, padding:10}}>
            <Text style={{fontSize: 20, color:"white", marginTop: 10}}>No se encontraron usuarios...</Text>
        </View>
      }
    </ScrollView>
    
  )
}
