import React, { useState } from 'react'
import {  Text, View, ActivityIndicator, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';

export const UserCard = ({persona, onClick, icono}) => {
    const [toggle, setToggle] = useState(false);
    const onPressButton = ()=> {
        setToggle(!toggle);
      };
  return (
    <TouchableHighlight underlayColor="00E88B" style={{width:'90%' , backgroundColor: Colors.PRIMARY_DARK_GRAYED  , borderRadius:10 , marginBottom:10}} onPress={ onPressButton}>
            
            <View style= {{padding:10 , justifyContent:'center'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{ fontWeight: 'bold', color: Colors.WHITE,height:40, fontSize:20, paddingTop:5, textAlign:'left'}}>{persona.name}</Text>
            <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, width:40, height:40}}  onPress={()=> {onClick }}>
                    <Ionicons size={25} color={Colors.WHITE} name={icono
                    }  />        
            </TouchableHighlight>
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
