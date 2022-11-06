import * as React from 'react';
import {Card, CardContent, CardMedia, TextField, Typography, Rating } from '@mui/material'
import {useState} from 'react';
import { useEffect } from 'react';
import "./event.css";

export default function Event (props) {

  const [imageURL, setImageURL] = useState( props.photos );

  useEffect( () => {
    setImageURL(props.photos);
  }, [props.photos]);

  return (
    <Card sx={{ width: "100%", height:"100%" }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {props.name}
        </Typography>

        <CardMedia
          component="img"
          className = "imgCard"
          style={{width:"100%"}}
          image={imageURL}
          alt={props.name}
        />

        <TextField
            style={{width:"100%", marginTop: "1.5rem", margionBottom:"1.5rem"}}
            multiline
            rows={2}
            readOnly
            disabled
            value={props.description}
        />
        <Typography variant="body2">
          by {props.owner} in {props.location}
        </Typography>
        <Rating readOnly value={props.score || 0} name="scoreProperty"/>
        <p style={{color:"blue", marginTop:"1rem"}}>
          ${props.price}
        </p>
      </CardContent>
    </Card>
  );
}