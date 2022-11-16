import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container } from "@mui/material";


export const EventPayments = () => {

    const [payments, setPayments] = useState([]);
    const API_URL = 'http://localhost:8000';

    const getEventsData = async () => {
        const paramsGet = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const url = `${API_URL}/events?owner=${localStorage.getItem("username")}`;
        const response = await fetch(
            url,
            paramsGet
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                const arrayPayments = [];
                const keys = Object.keys(jsonResponse);
                for ( let i=0; i<keys.length; i++){
                    for( let j=0; j<jsonResponse[keys[i]].paymentsReceived.length; j++){
                        const dateToUse = new Date(jsonResponse[keys[i]].paymentsReceived[j].date_of_payment);
                        jsonResponse[keys[i]].paymentsReceived[j].dateTransformed = `${dateToUse.getDate()}/${dateToUse.getMonth()+1}/${dateToUse.getFullYear()} - ${dateToUse.getHours()}:${dateToUse.getMinutes().length === 2? dateToUse.getMinutes() : "0"+dateToUse.getMinutes()}:${dateToUse.getSeconds()}`
                        arrayPayments.push({"event_name":jsonResponse[keys[i]].name, "payment":jsonResponse[keys[i]].paymentsReceived[j]})
                    }
                }
                setPayments(arrayPayments)
            }
        }     
    }

    useEffect( () => {
        getEventsData();
    }, [] );

  return (
    <Container>
        <h1 style={{textAlign:"center", marginTop:"1rem"}}>Payments Received</h1>
        {payments.length > 0 ?
        <TableContainer component={Paper} style={{marginTop:"2rem"}}>
            <Table aria-label="payments-table">
                <TableHead style={{backgroundColor: "black"}}>
                    <TableRow>
                        <TableCell style={{color:"white", fontWeight:"bold"}} align="left">Event</TableCell>
                        <TableCell style={{color:"white", fontWeight:"bold"}} align="left">Payer</TableCell>
                        <TableCell style={{color:"white", fontWeight:"bold"}} align="center">Date Of Payment</TableCell>
                        <TableCell style={{color:"white", fontWeight:"bold"}} align="center">Amount Paid</TableCell>
                        <TableCell style={{color:"white", fontWeight:"bold"}} align="left">Payment Method</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {payments.map((payment) => (
                    
                    <TableRow
                    key={payment.payment.reservation_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        {console.log(payment)}
                        <TableCell component="th" scope="row" align="left">
                            {payment.event_name}
                        </TableCell>
                        <TableCell align="left">{payment.payment.payer}</TableCell>
                        <TableCell align="center">{payment.payment.dateTransformed}</TableCell>
                        <TableCell align="center">U$D {payment.payment.amount}</TableCell>
                        <TableCell align="left">{payment.payment.payment_method}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        :
            <h4 style={{textAlign:"center", marginTop:"2rem"}}>You have no payments registered in your events yet.</h4>
        }
    </Container>
  );
}
