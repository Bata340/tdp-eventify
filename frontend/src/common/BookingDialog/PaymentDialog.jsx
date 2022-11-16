import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, 
    Button, TextField, Grid, InputLabel, Select, MenuItem, FormControl  } from "@mui/material";
import { BookingDialog } from "./BookingDialog";
import "./PaymentDialog.css";

export const PaymentDialog = (props) => {


    const [openDialogBooking, setOpenDialogBooking] = React.useState(false);
    const [cardNumber, setCardNumber] = React.useState("");
    const [classCardNumber, setClassCardNumber] = React.useState("");
    const [classDNI, setClassDNI] = React.useState("");
    const [dni, setDni] = React.useState("");
    const [typeOfCard, setTypeOfCard] = React.useState("Debit Card");


    const validateFields = () => {

        let valid = true;
        if(cardNumber.length < 16){
            setClassCardNumber("error-input-class");
            valid = false;
        }else{
            setClassCardNumber("");
        }

        if(dni.length < 6){
            setClassDNI("error-input-class");
            valid = false;
        }else{
            setClassDNI("");
        }

        return valid;
    }



    const proceedPayment = async () => {
        if ( validateFields() ){
            try{
                await props.paymentFunction(typeOfCard);
                props.setOpen(false);
                setOpenDialogBooking(true);
            }catch(e){
                console.error(e);
            }
        }
        
    }
  
    return (
      <>
        <Dialog open={props.open} onClose={() => {props.setOpen(false)}}>
          <DialogTitle>Pay {props.typeOfBooking.charAt(0).toUpperCase() + props.typeOfBooking.slice(1)}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              In order to book this {props.typeOfBooking.toLowerCase()} you have to pay with a card method:
            </DialogContentText>
            <Grid container item justifyContent="center" alignItems="center">
                <Grid item xs={12} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                    <FormControl className={"input-class-payment"}>
                        <InputLabel id="label_type_of_card">Card Type</InputLabel>
                        <Select
                            labelId="label_type_of_card"
                            id="type_of_card"
                            value={typeOfCard}
                            label="Card Type"
                            onChange={(event) => {setTypeOfCard(event.target.value)}}
                            
                        >
                            <MenuItem value={"Debit Card"}>Debit Card</MenuItem>
                            <MenuItem value={"Credit Card"}>Credit Card</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                    <TextField
                        id="card_number"
                        label="Card Number"
                        value={cardNumber}
                        onChange={(event) => {setCardNumber(event.target.value);}}
                        className = {classCardNumber+" input-class-payment"}
                        type="number"
                        onInput = {(e) =>{
                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,16)
                        }}
                    />
                </Grid>
                <Grid item xs={12} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                    <TextField
                        id="dni"
                        label="D.N.I"
                        className={classDNI+" input-class-payment"}
                        type="number"
                        value={dni}
                        onChange={(event) => {setDni(event.target.value);}}
                        onInput = {(e) =>{
                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,8)
                        }}
                    />
                </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => props.setOpen(false)}>Cancel</Button>
            <Button onClick={proceedPayment}>Pay</Button>
          </DialogActions>
        </Dialog>

        <BookingDialog showDialog={openDialogBooking} typeOfBooking={props.typeOfBooking} />
      </>
    );
}
