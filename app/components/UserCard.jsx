import React, { useEffect, useState } from 'react'
import {  Text, View, ActivityIndicator, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import UserAvatar from './UserAvatar';
import { getFirebaseImage } from '../utils/FirebaseHandler';

export const UserCard = ({persona}) => {
    const [toggle, setToggle] = useState(false);
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
    
    useEffect(() => {
      getImage();
    }, [])
    
  return (
    <TouchableHighlight underlayColor="00E88B" style={{width:'90%' , backgroundColor: Colors.PRIMARY_DARK_GRAYED  , borderRadius:10 , marginBottom:10}} onPress={ onPressButton}>
            
            <View style= {{padding:10 , justifyContent:'center'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            
            
            <View style={{ flexDirection: 'row' ,alignItems: 'flex-start' }}>
            <UserAvatar size={40} uri={image} />   
            <Text style={{ fontWeight: 'bold', color: Colors.WHITE,height:40, fontSize:20, paddingTop:5, textAlign:'left'}}>{persona.name}</Text>
            </View>

            <View style={{ flexDirection: 'row' ,alignItems: 'flex-end' }}>
              {
                persona.friends ? 
                <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, width:40, height:40}}  onPress={()=> { }}>
                  <Ionicons size={25} color={Colors.WHITE} name='person-remove-outline'
                    />        
                </TouchableHighlight>
                :<></>
              }
              {
                persona.request ? 
                <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, width:40, height:40}}  onPress={()=> { }}>
                  <Ionicons size={25} color={Colors.WHITE} name='paper-plane-outline'
                    />        
                </TouchableHighlight>
                :<></>
              }

              {
                (!persona.friends && !persona.request) ? 
                <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, width:40, height:40}}  onPress={()=> { }}>
                  <Ionicons size={25} color={Colors.WHITE} name='person-add-outline'
                    />        
                </TouchableHighlight>
                :<></>
              }
            </View>
              

            </View>
            
            {toggle ? 
            <View style= {{padding:10 }}>
                <Text style={{ fontWeight: 'normal', fontStyle:'italic', color: Colors.WHITE,  fontSize:18}}>Buenos Aires</Text>
                <Text style={{ fontWeight: 'normal', color: Colors.WHITE,  fontSize:18}}>
                    <Text>Edad</Text>   
                    <Text style={{fontWeight:'bold'}}>{1233}
                    </Text>
                    </Text>
            </View>
             : 
            <View >
                
            </View>
        
            }
            </View>
            
        
        </TouchableHighlight>
  )
}
