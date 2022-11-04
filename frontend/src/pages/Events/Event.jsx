import * as React from 'react';
import {Card, CardContent, CardMedia, TextField, Typography, Rating } from '@mui/material'
import {useState} from 'react';
import { useEffect } from 'react';

export default function Event (props) {

  const [imageURL, setImageURL] = useState( props.photos );

  useEffect( () => {
    setImageURL(props.photos);
  }, [props.photos]);

  return (
    <Card sx={{ maxWidth: "100%", height:"100%" }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {props.name}
        </Typography>

        <CardMedia
          component="img"
          height="194"
          image={imageURL}
          alt={props.name}
        />

        <TextField 
            variant="body1"
            rows={4}
            readOnly
        >
          {props.description}
        </TextField>
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