import UsersList from '../components/UsersList'
import UserAvatar from '../components/UserAvatar';
import Entypo from '@expo/vector-icons/Entypo';
import {View, Text, FlatList} from 'react-native';
import Colors from '../constants/Colors';

import React from 'react';


const MAX_SHOW_FRIENDS = 2;

export default function AttendingFriends (props) {

    return (
        <View style={{ marginTop: 20, borderRadius: 20, backgroundColor: Colors.PRIMARY_DARK_GRAYED, paddingLeft: 25, paddingVertical: 25 }} onPress={()=>UsersList(props.usersFriends)}>
                <Text style={{ textAlign:"center", fontWeight: 'bold', color: Colors.WHITE, fontSize: 20, marginTop: 5 }}> <Entypo size={35} name="users" />Amigos que asisten {props.usersFriends.length}
                </Text>
                <FlatList horizontal data={props.usersFriends.map(f => f.profilePic).splice(0, 2)} renderItem={({item}) => <UserAvatar uri={item}/>}/>
        </View>
    )
}




