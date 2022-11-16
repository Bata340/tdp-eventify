import QRCode from "react-qr-code";
import { Card, CardContent, CardActions, Grid } from '@mui/material';

export const EventBookingView = (props) => {

    const dateEvent = new Date(props.dateEvent);

  return (
    <Card sx={{ maxWidth: "100%" }}>
        <CardContent>
            <Grid container alignItems = "center" justifyContent="center">
                <Grid item xs={12}>
                    <QRCode value = {props.QRData} style={{display:"block", margin:"auto"}}/>
                </Grid>
                <Grid item xs={12} style={{marginTop:"1rem"}}>
                    <h4 style={{textAlign:"center"}}>{props.nameEvent}</h4>
                </Grid>
                <Grid item xs={12}>
                    <h6 style={{textAlign:"center"}}>Date of event: {`${dateEvent.getDate()}/${dateEvent.getMonth()+1}/${dateEvent.getFullYear()}`}</h6>
                </Grid>
                <Grid item xs={12}>
                    <h6 style={{textAlign:"center"}}>Location: {props.locationEvent}</h6>
                </Grid>
            </Grid>
        </CardContent>
      </Card>
  )
}
