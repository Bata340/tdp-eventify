import { Container, Grid, CircularProgress } from '@mui/material';
import React from 'react';
import MyEvent from './MyEvent';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';


export const MyEvents = () => {

    const API_URL = 'http://localhost:8000';

    const [ eventos, setEventos ] = useState ( [] );
    const [ loading, setLoading ] = useState( true );
    const [ urlsImages, setUrlsImages ] = useState( [] );

    async function getImagesFromFireBase( eventosVar ){
        const urlsArray = [];
        for ( let i=0; i < eventosVar.length ; i++ ){
            const arrayURLS = [];
            for ( let j=0; j < eventosVar[i].photos.length ; j++ ){
                const url = await getFirebaseImage( 
                    `files/${eventosVar[i].photos[j]}`
                );
                arrayURLS.push(url);
            }
            urlsArray.push(arrayURLS);
        }
        setUrlsImages( urlsArray );
        setEventos( eventosVar );
        setLoading( false );
    }

    async function getUserEvents(user){
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/events?owner=${user}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayProps = [];
                const keys = Object.keys(jsonResponse);
                for ( let i=0; i<keys.length; i++){
                    arrayProps.push(jsonResponse[keys[i]]);
                }
                await getImagesFromFireBase(arrayProps);
            }
        }     
    }


    useEffect( () => {
        getUserEvents(localStorage.getItem('username'));
    }, []);


    return (    
        !loading ? 
        <Container>
            <Grid container spacing={6}>
                {eventos.map( (prop, idx) => {
                    return (
                        <Grid style={{"marginTop":"2rem"}} item xs={12} md={6} lg={4} key={`${prop.key}_${urlsImages[idx]}`}>
                            <MyEvent 
                                id={prop.key}
                                key={`${prop.key}_${urlsImages[idx]}`}
                                name={prop.name} 
                                owner={prop.owner} 
                                price={prop.price} 
                                description={prop.description} 
                                location={prop.location} 
                                score={prop.score} 
                                photos={ urlsImages.length > 0 ? urlsImages[idx] : []}
                                photosName = {prop.photos}
                            />
                        </Grid>
                    )})}
            </Grid>
        </Container>
        : <CircularProgress 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            margin: 'auto',
            width: '10vw'
          }}
        />
    ) ;
}