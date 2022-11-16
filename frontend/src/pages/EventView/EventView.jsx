import { Button, Container, Grid, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, 
    DialogActions, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PhotoEvent } from '../EventsEdit/PhotoEvent';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import startOfDay from "date-fns/startOfDay";
import Carousel from 'react-material-ui-carousel';
import './EventView.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { PaymentDialog } from "../../common/BookingDialog/PaymentDialog";

export const EventView = (props) => {

    const [searchParams] = useSearchParams();
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [bookingDate, setBookingDate] = useState(null);
    const [event, setEvent] = useState('');
    const [showSureBookingDialog, setShowSureBookingDialog] = useState(false);
    const [errorDialog, setErrorDialog] = useState("");
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();


    const isInvalidDate = (date) => {
        const dateAsYMD = date.toISOString().substr(0,10);
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() - 1);
        if ( event.eventDates.length > 0 ){
            const existingDate = event.eventDates.filter(eventDate => eventDate.substr(0,10) === dateAsYMD);
            return (date < todayDate || existingDate.length <= 0)
        }else{
            return date < todayDate;
        }
    }


    const onSubmit = async (typeOfCard) => {
        if(!bookingDate){
            setErrorDialog("You must select a booking date before continuing.");
            setShowErrorDialog(true);
            return;
        }
        setShowSureBookingDialog(false);
        const paramsPost = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id":searchParams.get("id"),
                "userid": localStorage.getItem("username"),
                "dateReserved": bookingDate.toISOString(),
                "typeOfCard": typeOfCard
            })
        };
        const url = `${API_URL}/event/reserve/${searchParams.get("id")}`;
        const response = await fetch(
            url,
            paramsPost
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                window.dispatchEvent(new Event('payment'));
                return;
            }
            throw new Error("Status Code Error: " + jsonResponse.status_code+ ". Detail: " + jsonResponse.detail);
        }
        throw new Error("Status Code Error:" + response.status);
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
    //eslint-disable-next-line
    }, []);


    const handleFormSubmit = (event) => {
        event.preventDefault();
        if(bookingDate != null){
            setShowSureBookingDialog(true);
        }else{
            setErrorDialog("You must select a booking date before continuing.");
            setShowErrorDialog(true);
        }
    }

  return (
    <>
        <form onSubmit = {handleFormSubmit}>
            
            <Container spacing={12}  sx={{ width: '80%' }} id="formWrapper">
                <Grid container item xs={4} md={1} className={"buttonClass"} marginBottom={5}>
                        <Button type="button" variant="contained" color="error"   onClick={goBackToHome}>Back</Button>
                </Grid>
                <Grid container item xs={12}>
                    <Grid 
                        className="carouselContainer"
                        container 
                        item 
                        xs={12} 
                        md={6} 
                    >
                        <Carousel className = "photoCarouselResponsive">
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
                    
                    <Grid container item xs={12} md={5} className={"LogoContainer"} >
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
                                <p style={{wordWrap:"break-word"}}>{event.eventDate}</p> 
                            </Container>
                        </Grid> 
                        <Grid container item xs={12} sx={{marginTop:"1.5rem"}}>
                            <Container sx={{textAlign:"left"}}>
                                <Rating readOnly value={event.score || 0} name="scoreEvent"/>
                            </Container>
                        </Grid> 
                    </Grid>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Grid container item justifyContent="center" alignItems="center">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    id="bookingDate"
                                    label="Booking Date"
                                    inputFormat="dd/MM/yyyy"
                                    value={bookingDate || null}
                                    onChange={(event) => {
                                        if(!isInvalidDate(event)){
                                            setBookingDate(startOfDay(new Date(event.toISOString())));
                                        }else{
                                            setBookingDate(null);
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                    shouldDisableDate={isInvalidDate}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Container>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>{event.price > 0 ? 'Buy':'Book'}</Button>
                    </Container>
                </Grid>
            </Container>
        </form>
        <PaymentDialog open={showSureBookingDialog} setOpen={setShowSureBookingDialog} paymentFunction={onSubmit} typeOfBooking={"event"} />
        <Dialog
                open={showErrorDialog}
                onClose={() => setShowErrorDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Error
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {errorDialog}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowErrorDialog(false)}>OK</Button>
                </DialogActions>
        </Dialog>
    </>
  )
}