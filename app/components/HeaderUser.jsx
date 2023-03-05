import React, { useState } from 'react'
import { useGlobalAuthContext } from '../utils/ContextFactory';
import { ScrollView, Text, View, TouchableHighlight, RefreshControl } from 'react-native';
import Colors from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UserAvatar from '../components/UserAvatar';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';


export const HeaderUser = () => {
    const appAuthContext = useGlobalAuthContext();
    
    const [toggle, setToggle] = useState(false);
    const navigation = useNavigation();
    const onPressButton = ()=> {
        setToggle(!toggle);
      };
  return (

    
    <TouchableHighlight underlayColor="00E88B" onPress={ onPressButton} style={{ paddingHorizontal: 30, paddingTop: 60, paddingBottom: 10, backgroundColor: Colors.PRIMARY_DARKER, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                
                <View>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{ color: Colors.WHITE, fontWeight: 'bold', fontSize: 20 }}>Hola,{"\n"}{appAuthContext.userSession.getUserFullName()}</Text>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 1,  flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row' ,alignItems: 'flex-end' }}>
                            <FontAwesome name="bell-o" style={{paddingBottom:12, marginRight:5}} color={Colors.WHITE} size={25} />
                            <UserAvatar size={50} uri={appAuthContext.userSession.getUserAvatar()} />
                        </View>
                    </View>
                </View>
                {toggle ? 
            <View style= {{padding:10,flexDirection:'row', justifyContent:'space-between' }}>
                <View >
                       <Text style={{ color: Colors.WHITE, fontSize: 22 }}><Ionicons size={23} color={Colors.PRIMARY} name="location-outline" />  Buenos Aires</Text>
                </View>

                {/* <TouchableHighlight underlayColor="00E88B" style={{alignItems:'center',backgroundColor:Colors.PRIMARY, borderRadius:20, padding:5, width:40, height:40}}  onPress={()=> {navigation.navigate("ShowPeople") }}>
                    <Ionicons size={25} color={Colors.WHITE} name="people-outline"  />        
                </TouchableHighlight> */}
                    
            </View>
             : 
            <View >
                
            </View>
        
            }
               
               {/*<View style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
                   <View style={{ flex: 1, marginRight: 10 }}>
                       <Button
                           title={"EVENTOS POPULARES"}
                           color={Colors.PRIMARY}
                           titleColor={Colors.WHITE}
                           titleSize={16}
                           titleStyle={{ fontWeight: "bold", textAlign:"center" }}
                           style={{width: "100%"}}
                           numOfLines={2}
                       />
                   </View>
                   <View style={{ flex: 1 }}>
                       <Button
                           numberOfLines={2}
                           title={"EVENTOS\nCERCANOS"}
                           color={Colors.PRIMARY}
                           titleColor={Colors.WHITE}
                           titleSize={16}
                           titleStyle={{ fontWeight: "bold", textAlign:"center" }}
                           inactive={true}
                           numOfLines={2}
                       />
                   </View>
               </View>*/}
                </View>
                
            </TouchableHighlight>
  )
}
