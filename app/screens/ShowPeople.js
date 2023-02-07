import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { UsersList } from '../components/UsersList';
import { getFirebaseImage } from '../utils/FirebaseHandler';

import Colors from '../constants/Colors';
import AppConstants from '../constants/AppConstants';
import ScreenTitle from '../components/ScreenTitle';

export default function ShowPeople(id_persona ='' , id_evento = '') {
    
    const [users, setUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);


    async function getUsers(){
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${AppConstants.API_URL}/events`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayUsers = [];
                for(let i=0; i<jsonResponse.length; i++){
                    const date = new Date(jsonResponse[i].eventDates[0]);
                    let imageURI;
                    try{
                        imageURI = await getFirebaseImage("files/"+jsonResponse[i].photos[0]);
                    }catch(exception){
                        //Image not available
                        imageURI = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
                    }
                    arrayUsers.push({
                        _id: jsonResponse[i]._id.$oid,
                        id: jsonResponse[i].key,
                        name: jsonResponse[i].name,
                        image: imageURI
                    });
                }
                setUsers(arrayUsers);
            }
        }     
    }
  
  
    useEffect( () => {
        getUsers();
    // eslint-disable-next-line
    }, []);
    
    const agregar = ()=>{

    }


    return (
        <View style={{ backgroundColor: Colors.PRIMARY_VERY_DARK_GRAYED,alignContent:'center', paddingTop: 50, height: '100%', }}>
            <ScreenTitle style={{}} title='Usuarios'></ScreenTitle>
            <UsersList usuarios={users} onClick={agregar} icon='add-outline'></UsersList>
            
        </View>
    )
}
