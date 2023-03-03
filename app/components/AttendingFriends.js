import UsersList from '../components/UsersList'
import UserAvatar from '../components/UserAvatar';
import Entypo from '@expo/vector-icons/Entypo';
import {View, Text, FlatList} from 'react-native';
import Colors from '../constants/Colors';
import React from 'react';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { getFirebaseImage } from '../utils/FirebaseHandler';

const MAX_SHOW_FRIENDS = 2;

export default function AttendingFriends (props) {
    const [friends, setFriends] = React.useState(props.usersFriends);
    const [profiles, setProfiles] = React.useState([])

    React.useEffect(() => {
        getUsersFriendsImage()
    }, [props.usersFriends]) 

    
    async function getImage(persona){
      let imageURI;
      try{
        imageURI = await getFirebaseImage('files/'+persona.profilePic);
      }catch(exception){
        //Image not available
        imageURI = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
      }
      return imageURI
    }

    async function getUsersFriendsImage (){
      const friendsProfilePics = []
        
      for (let i = 0; i < friends.length; i++){
          const uri = await getImage(friends[i].profilePic)
          friendsProfilePics.push(uri);
        }
        setProfiles(friendsProfilePics);
    }


    return (
        <View style={{ marginTop: 20, borderRadius: 20, backgroundColor: Colors.PRIMARY_DARK_GRAYED, paddingLeft: 25, paddingVertical: 25, }}  onPress={()=>UsersList(friends)}>
                <Text style={{ textAlign:"center", fontWeight: 'bold', color: Colors.WHITE, fontSize: 20, marginTop: 5 }}> <Entypo size={35} name="users" />Amigos que asisten {usersFriends.lenght}
                </Text>
                <FlatList horizontal data={profiles.splice(0,MAX_SHOW_FRIENDS)} renderItem={({item}) => <UserAvatar uri={item}/>}/>

        </View>
    )
    }
//</ScrollView>

//<FlatList horizontal data={DATA} renderItem={renderItem} /> 
//

//<View style={{flexDirection:"row", alignItems:"center", marginHorizontal:50}}>
//<UserAvatar size={20} uri={appAuthContext.userSession.getUserAvatar()} />
//</View>