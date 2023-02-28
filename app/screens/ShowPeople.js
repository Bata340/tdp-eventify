import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { UsersList } from '../components/UsersList';
import { getFirebaseImage } from '../utils/FirebaseHandler';

import Colors from '../constants/Colors';
import AppConstants from '../constants/AppConstants';
import ScreenTitle from '../components/ScreenTitle';
import { useGlobalAuthContext } from '../utils/ContextFactory';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ShowPeople(id_persona ='' , id_evento = '') {
    
    const [users, setUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const appAuthContext = useGlobalAuthContext();
    const userId = appAuthContext.userSession.getUserId();
    
    const [tabSelectec, setTabSelectec] = useState(1)
    const styles = StyleSheet.create({
        text: {padding:10},
         selected: {
            backgroundColor:Colors.PRIMARY
        },
        unselected: {
            backgroundColor:Colors.PRIMARY_DARK_GRAYED,
        },
    });
    async function getUsers(){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/usersWithFriendship?userId=${userId}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayUsers = [];
                for(let i=0; i<jsonResponse.length; i++){
                    arrayUsers.push({
                        "id": jsonResponse[i].id,
                        "name": jsonResponse[i].name,
                        "email": jsonResponse[i].email,
                        "profilePic": jsonResponse[i].profilePic,
                        "request": jsonResponse[i].request,
                        "friends": jsonResponse[i].friends
                    });
                }
                setUsers(arrayUsers);
            }
        }else{

        }   
        //setUsers(JSON.stringify(jsonResponse)); 
    }

    async function getFriends(){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/usersWithFriendship?userId=${userId}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayUsers = [];
                for(let i=0; i<jsonResponse.length; i++){
                    if(jsonResponse[i].friends){
                        arrayUsers.push({
                            "id": jsonResponse[i].id,
                            "name": jsonResponse[i].name,
                            "email": jsonResponse[i].email,
                            "profilePic": jsonResponse[i].profilePic,
                            "request": jsonResponse[i].request,
                            "friends": jsonResponse[i].friends
                        });
                    }

                }
                setUsers(arrayUsers);
            }
        }else{

        }   
        //setUsers(JSON.stringify(jsonResponse)); 
    }
    async function getRequests(){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/user/${userId}/friendRequests`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayUsers = [];
                for(let i=0; i<jsonResponse.length; i++){
                    arrayUsers.push({
                        "id": jsonResponse[i].id,
                        "name": jsonResponse[i].name,
                        "email": jsonResponse[i].email,
                        "profilePic": jsonResponse[i].profilePic,
                        "toAccept": true,
                    });
                }
                setUsers(arrayUsers);
            }
        }else{

        }   
        //setUsers(JSON.stringify(jsonResponse)); 
    }
  
    useEffect( () => {
        
        switch (tabSelectec) {
            case 2:
                getRequests();
                break;
            case 3:
                getFriends();
            break;
        
            default:
                getUsers();
                break;
        }
    //getUsers()
    // eslint-disable-next-line
    }, [tabSelectec]);
    
    const agregar = ()=>{

    }

//{padding:10, borderRadius:15,backgroundColor:Colors.PRIMARY_DARK_GRAYED},
    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED,alignContent:'center', paddingTop: 50, height: '100%', }}>
            <ScreenTitle style={{}} title='Usuarios'></ScreenTitle>
            <View style={{flexDirection:'row', justifyContent:'space-around', backgroundColor:Colors.PRIMARY_DARK_GRAYED}}>
                <View style={[styles.text, tabSelectec == 1  ? styles.selected : styles.unselected]}>
                    <Ionicons  size={25}  color={Colors.WHITE}   name='people-outline' onPress={()=> {setTabSelectec(1)}}/>
                </View>

                <View style={[styles.text, tabSelectec == 2  ? styles.selected : styles.unselected]}>
                    <Ionicons size={25} color={Colors.WHITE} name='person-add-outline' onPress={()=> {setTabSelectec(2)}}/>
                </View>

                <View style={[styles.text, tabSelectec == 3  ? styles.selected : styles.unselected]}>
                    <Ionicons size={25} color={Colors.WHITE} name='heart-outline' onPress={()=> {setTabSelectec(3)}}/>  
                </View>
                

                
                
            </View>
            <UsersList usuarios={users}  ></UsersList>
            {/* <Text>{users} </Text> */}
        </View>
    )
}
