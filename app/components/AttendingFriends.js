import UsersList from '../components/UsersList'
import UserAvatar from '../components/UserAvatar';
import Entypo from '@expo/vector-icons/Entypo';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import React from 'react';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { getFirebaseImage } from '../utils/FirebaseHandler';

const MAX_SHOW_FRIENDS = 2;

export default function AttendingFriends (props) {
    const [profiles, setProfiles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigation = useNavigation();

    React.useEffect(() => {
      setLoading(true);
      getUsersFriendsImage();
    }, [props.usersFriends]); 

    
    async function getImage(persona){
      let imageURI;
      try{
        imageURI = await getFirebaseImage('files/'+persona.profilePic);
      }catch(exception){
        imageURI = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
      }
      return imageURI;
    }

    async function getUsersFriendsImage (){
      const friendsProfilePics = [];
      for (let i = 0; i < props.usersFriends.length; i++){
          const uri = await getImage(props.usersFriends[i]);
          friendsProfilePics.push({uri : uri});
      }
      setLoading(false);
      setProfiles(friendsProfilePics);
    }


    return (
        <TouchableOpacity 
          style={{ marginTop: 20, borderRadius: 20, backgroundColor: Colors.PRIMARY_DARK_GRAYED, paddingLeft: 25, paddingVertical: 25, }}  
          onPress={()=>{
            if(props.usersFriends.length > 0){
              navigation.navigate('PeopleInEvent', {usuarios: props.usersFriends, showButtons: false});
            }
          }}>
          <View>
            <Text style={{ textAlign:"center", fontWeight: 'bold', color: Colors.WHITE, fontSize: 20, marginTop: 5 }}> <Entypo size={30} name="users" /> 
            &nbsp; Amigos que asisten 
            </Text>
          </View>
          <View style={{justifyContent:"center", alignItems:"center", marginTop:20}}>
            {
            loading ? 
              <ActivityIndicator size="large" color="#00ff00" />
            :
              <FlatList horizontal data={profiles.map(f => f.uri).splice(0, MAX_SHOW_FRIENDS)} renderItem={({item}) => <UserAvatar uri={item}/>}/>
            }
          </View>
        </TouchableOpacity>
    )
    }
