import { Button, Container, Grid, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PhotoEvent } from '../EventsEdit/PhotoEvent';
import Carousel from 'react-material-ui-carousel';

export const EventView = (props) => {

    const [searchParams] = useSearchParams();
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [event, setEvent] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        const paramsPost = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                /*VER ESTO*/
                "id":searchParams.get("id"),
                "userid": localStorage.getItem("username")
            })
        };
        const url = `${API_URL}/events/reserve/${searchParams.get("id")}`;
        const response = await fetch(
            url,
            paramsPost
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                setShowDialog(true);
            }
        }
    }

    const goBackToHome = (event) => {
      navigate('/');
    }


    const getDataForFields = async (id) => {
        const paramsUpload = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/event/${id}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){

                setPhotosNamesHashed(jsonResponse.message.photos);
                setEvent(jsonResponse.message);
            }
        }
    }


    useEffect(() => {
        getDataForFields(searchParams.get("id"));
    }, []);


  return (
    <>
        <form onSubmit = {onSubmit}>
            
            <Container spacing={12}  sx={{ width: '80%' }} id="formWrapper">
                <Grid container item xs={1} className={"buttonClass"} marginBottom={5}>
                        <Button type="button" variant="contained" color="error"   onClick={goBackToHome}>Back</Button>
                </Grid>
                <Grid container item xs={12}>
                    <Grid container item xs={6} sx={{marginRight:"2rem"}}>
                        <Carousel sx={{width:"80%", margin:"auto", justifyContent:"center"}}>
                            {
                                photosNamesHashed.map((slideImage, index) => {
                                    return(
                                        <Grid
                                            key={index}
                                            container
                                            justify-content="center"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <PhotoEvent  nameImage={slideImage} read={true} onRemoveImage = {null}/>
                                        </Grid>
                                    );
                                })
                            }
                        </Carousel>
                    </Grid>
                    
                    <Grid container item xs={5} className={"LogoContainer"} >
                        <Grid container item xs={12} sx={{borderBottom:"1px solid black", marginBottom:"1.5rem"}}>
                            <h1 sx={{fontWeight:"bold", wordWrap:"break-word"}}>{event.name}</h1>
                        </Grid>   
                        <Grid container item xs={12}>
                            <Container sx={{textAlign:"left"}}>
                                <h2>
                                    <strong>U$D {event.price}</strong>
                                </h2>
                                
                            </Container>
                        </Grid> 
                        <Grid container item xs={12} sx={{marginTop:"1.5rem"}}>
                            <Container sx={{textAlign:"left", border:"1px solid gray", borderRadius:"10px", backgroundColor:"lightgray", paddingTop:"5px"}}>
                                <p style={{wordWrap:"break-word"}}>{event.description}</p> 
                            </Container>
                        </Grid> 
                        <Grid container item xs={12} sx={{marginTop:"1.5rem"}}>
                            <Container sx={{textAlign:"left"}}>
                                <Rating readOnly value={event.score || 0} name="scoreEvent"/>
                            </Container>
                        </Grid> 
                    </Grid>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>{event.price > 0 ? 'Buy':'Book'}</Button>
                    </Container>
                </Grid>
            </Container>
        </form>
        <Dialog
            open={showDialog}
            onClose={goBackToHome}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Booking was succesful"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                You have booked this event succesfully. 
                <br/>
                <br/><br/>
                We will return you to the homepage after closing this dialog.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={goBackToHome}>OK</Button>
            </DialogActions>
      </Dialog>
    </>
  )
}