import { Container, Grid, CircularProgress } from '@mui/material';
import React from 'react';
import Event from './Event';
import { getFirebaseImage } from '../../common/FirebaseHandler';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import "./events.css";

export const Events = () => {

  const API_URL = 'http://localhost:8000';

  const [ eventos, setEventos ] = useState ( [] );
  const [ loading, setLoading ] = useState( true );
  const [ urlsImages, setUrlsImages ] = useState( [] );

  let navigate = useNavigate(); 
  const routeChange = (prop) =>{ 
    let path = `/event?id=${prop.key}`; 
    navigate(path);
  }

  async function getImagesFromFireBase( eventos ){
      const urlsArray = [];
      for ( let i=0; i < eventos.length ; i++ ){
          if(eventos[i].photos.length > 0){
              const url = await getFirebaseImage( 
                  `files/${eventos[i].photos[0]}`
              );
              urlsArray.push(url);
          }else{
            urlsArray.push("");
          }
          
      }
      setUrlsImages( urlsArray );
      setEventos( eventos );
      setLoading( false );
  }


  async function getEvents(){
      const paramsUpload = {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
          }
      };
      const url = `${API_URL}/events`;
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
      getEvents();
  // eslint-disable-next-line
  }, []);


  return (    
      !loading ? 
      <Container>
          <Grid container>
              
              {eventos.map( (prop, idx) => {
                  return (
                      <Grid 
                          style={{"marginTop":"2rem"}} 
                          item 
                          xs={4} 
                          key={`${prop.key}_${urlsImages[idx]}`} 
                          onClick={() => {routeChange(prop)}}
                          className = {"eventCard"}
                      >
                          <Event 
                              key = {`${prop.key}_${urlsImages[idx]}`}
                              name={prop.name} 
                              owner={prop.owner} 
                              price={prop.price} 
                              description={prop.description} 
                              location={prop.location} 
                              score={prop.score} 
                              photos={ urlsImages.length > idx ? urlsImages[idx]: "" }
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
