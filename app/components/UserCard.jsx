import React, { useEffect, useState } from 'react'
import {  Text, View, ActivityIndicator, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import UserAvatar from './UserAvatar';
import { getFirebaseImage } from '../utils/FirebaseHandler';
import { useGlobalAuthContext } from '../utils/ContextFactory';
import { async } from '@firebase/util';
import AppConstants from '../constants/AppConstants';

export const UserCard = ({persona}) => {
    const [toggle, setToggle] = useState(false);
    const [request, setRequest] = useState(persona.request);
    const [friends, setFriends] = useState(persona.friends);
    const [toAccept, setToAccept] = useState(persona.toAccept);

    const appAuthContext = useGlobalAuthContext();
    const userId = appAuthContext.userSession.getUserId();
   

    const onPressButton = ()=> {
        setToggle(!toggle);
      };
    const [aux, setAux] = useState('')
    const [image, setImage] = useState(null)

    async function getImage(){
      let imageURI;
      try{
        imageURI = await getFirebaseImage('files/'+persona.profilePic);
      }catch(exception){
        //Image not available
        setAux(JSON.stringify(exception) )
        imageURI = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
      }
      setImage(imageURI);
      
    }
    
    async function sendRequest(){
      const paramsPost = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
      };
      const url = `${AppConstants.API_URL}/user/${userId}/request?toUserId=${persona.id}`;
      const response = await fetch(
          url,
          paramsPost
      );
      const jsonResponse = await response.json();
      if (response.status === 200){
          setRequest(true);
          
      }else{
         
      }
    }

    async function acceptRequest(){
      const paramsPost = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
      };
      const url = `${AppConstants.API_URL}/user/${userId}/acceptRequest?friendId=${persona.id}`;
      const response = await fetch(
          url,
          paramsPost
      );
      const jsonResponse = await response.json();
      if (response.status === 200){
          setFriends(true);
          setToAccept(false);
          
      }else{
         
      }
    }

    useEffect(() => {

      getImage();
    }, [])
    
  return (
    <TouchableHighlight underlayColor="00E88B" style={{width:'90%' , backgroundColor: Colors.PRIMARY_DARK_GRAYED  , borderRadius:10 , marginBottom:10}} onPress={ onPressButton}>
            
            <View style= {{padding:10 , justifyContent:'center'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            
            
            <View style={{ flexDirection: 'row' ,alignItems: 'flex-start' }}>
            <UserAvatar size={40} uri={image} />   
            <Text style={{ fontWeight: 'bold', color: Colors.WHITE,height:40, fontSize:20, paddingTop:5, textAlign:'left'}}>&nbsp;{persona.name}</Text>
            </View>

            <View style={{ flexDirection: 'row' ,alignItems: 'flex-end' }}>
              {
                friends ? 
                <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, width:40, height:40}}  onPress={()=> {setFriends(false) }}>
                  <Ionicons size={25} color={Colors.WHITE} name='person-remove-outline'
                    />        
                </TouchableHighlight>
                :<></>
              }
              {
                request && !friends ? 
                <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, paddingTop:7, width:40, height:40}}  onPress={()=> { }}>
                  <Ionicons size={25} color={Colors.WHITE} name='paper-plane-outline'
                    />        
                </TouchableHighlight>
                :<></>
              }

              {
                (!friends && !request && !toAccept ) ? 
                <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, width:40, height:40}}  onPress={()=> { sendRequest()}}>
                  <Ionicons size={25} color={Colors.WHITE} name='person-add-outline'
                    />        
                </TouchableHighlight>
                :<></>
              }
              {
                toAccept ?
                <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, width:40, height:40}}  onPress={()=> { acceptRequest()}}>
                <Ionicons size={25} color={Colors.WHITE} name='checkmark-outline'
                  />        
              </TouchableHighlight>
              :<></>
              }
            </View>
              

            </View>
            </View>
            
        
        </TouchableHighlight>
  )
}
