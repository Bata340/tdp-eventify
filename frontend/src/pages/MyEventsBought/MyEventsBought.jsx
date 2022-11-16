import { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { EventBookingView } from './EventBookingView';



export const MyEventsBought = () => {

  const API_URL = 'http://localhost:8000';
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    const paramsGet = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const url = `${API_URL}/user/event-reservations/${localStorage.getItem("username")}`;
    const response = await fetch(
        url,
        paramsGet
    );
    const jsonResponse = await response.json();
    if (response.status === 200){
        if(!jsonResponse.status_code){
            setBookings(jsonResponse);
            return;
        }
    }
  }

  useEffect( () => {
    getBookings();
  }, [] );


  return (
    <Container>
        <h1 style={{textAlign:"center"}}>My Event Tickets</h1>
        <Grid container alignItems="center" justifyContent="center" style={{marginTop:"2rem"}} spacing={4}>
        {
            bookings.map((booking, index) => {
                return (
                    <Grid key={booking.id+"_"+index} item xs={12} md={6} lg={4} >
                        {console.log(booking)}
                        <EventBookingView 
                            key = {booking.id+"_"+index}
                            QRData = {JSON.stringify({
                                "dateReserved": booking.reservation.dateReserved,
                                "user": booking.reservation.userid,
                                "reservation_id": booking.reservation.id,
                                "event_id": booking.event.key,
                                "price": booking.event.price,
                                "payment_method": booking.reservation.typeOfCard
                            })}
                            nameEvent = {booking.event.name}
                            dateEvent = {booking.reservation.dateReserved}
                            locationEvent = {booking.event.location}
                        />
                    </Grid>
                );
            })
        }
        </Grid>
    </Container>
  )
}
