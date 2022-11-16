import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export const BookingDialog = (props) => {

    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    const goBackToHome = (event) => {
        navigate('/');
    }


    useEffect( () => {
        if(props.showDialog){
            setShowDialog(true);
        }else{
            setShowDialog(false);
        }
    }, [props.showDialog] );


  return (
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
            You have booked this {props.typeOfBooking.toLowerCase()} succesfully. 
            <br/>
            <br/>
            We will return you to the homepage after closing this dialog.
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => {goBackToHome()}}>OK</Button>
        </DialogActions>
    </Dialog>
  )
}
