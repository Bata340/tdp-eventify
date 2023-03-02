import UsersList from '../components/UsersList'
import UserAvatar from '../components/UserAvatar';
import Entypo from '@expo/vector-icons/Entypo';
import {View, Text, FlatList} from 'react-native';
import Colors from '../constants/Colors';

import React from 'react';


const MAX_SHOW_FRIENDS = 2;

export default function AttendingFriends (props) {
    const {usersFriends} = props;
    const [friends, setFriends] = React.useState(usersFriends);

    React.useEffect(() => {
        setFriends(usersFriends)
    }, [usersFriends])

    const ShowFriends = () => {
        let amount = friends.size < MAX_SHOW_FRIENDS? friends.size : MAX_SHOW_FRIENDS;
        const friendsProfilePics = []
        for (i; i < amount; i++){
            friendsProfilePics.push(friends[i].profilePic);
        }
        return friendsProfilePics;
    }

    return (
        <View style={{ marginTop: 20, borderRadius: 20, backgroundColor: Colors.PRIMARY_DARK_GRAYED, paddingLeft: 25, paddingVertical: 25 }} onPress={()=>UsersList(friends)}>
                <Text style={{ textAlign:"center", fontWeight: 'bold', color: Colors.WHITE, fontSize: 20, marginTop: 5 }}> <Entypo size={35} name="users" />Amigos que asisten {friends.length}
                        <FlatList horizontal data={() => ShowFriends()} renderItem={({item}) => <UserAvatar uri={item.profilePic}/>}/>
                </Text>
        </View>
    )
}




