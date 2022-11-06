import { Button, Container, TextField, Alert, AlertTitle, Collapse, Input, 
    CircularProgress, FormControlLabel, Checkbox, Grid, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleUploadFirebaseImage } from '../../common/FirebaseHandler';
import { DatePicker, StaticDatePicker, PickersDay } from '@mui/x-date-pickers';
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import startOfDay from "date-fns/startOfDay";
import './EventsUpload.css';

export const EventsUpload = (props) => {

    const [price, setPrice] = useState(0);
    const [eventName, setEventName] = useState('');
    const [location, setLocation] = useState('');
    const [hasMaxCapacity, setHasMaxCapacity] = useState(false);
    const [hasSpecificDates, setHasSpecificDates] = useState(false);
    const [maxCapacity, setMaxCapacity] = useState(null);
    const [description, setDescription] = useState('');
    const [eventDates, setEventDates] = useState([]);
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [photosUpload, setPhotosUpload] = useState([]);
    const [fileInputShow, setFileInputShow] = useState("");
    const [showErrorEventUpload, setShowErrorEventUpload] = useState(false);
    const [errorEventUpload, setErrorEventUpload] = useState('');
    const [loadingAsync, setLoadingAsync] = useState(false);
    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();


    const CustomPickersDay = styled(PickersDay, {
        shouldForwardProp: (prop) => prop !== "selected"
      })(({ theme, selected }) => ({
        ...(selected && {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          "&:hover, &:focus": {
            backgroundColor: theme.palette.primary.dark
          },
          borderTopLeftRadius: "50%",
          borderBottomLeftRadius: "50%",
          borderTopRightRadius: "50%",
          borderBottomRightRadius: "50%"
        })
      }));


    const onSubmitUpload = async (event) => {
        event.preventDefault();
        setLoadingAsync(true);
        let photosNames = await handleUploadPhotos();
        const paramsUpload = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: eventName,
                owner: localStorage.getItem('username'),
                price: price,
                description: description,
                location: location,
                score: 0,
                maxAvailability: maxCapacity,
                eventDates: eventDates,
                photos: photosNames
            })
        };
        const url = `${API_URL}/event/`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        setLoadingAsync(false);
        if (response.status === 200){
            if(!jsonResponse.status_code){
                navigate('/');
                window.location.reload();
            }else{
                setErrorEventUpload(jsonResponse.detail);
                setShowErrorEventUpload(true);
            }
        }
    }

    const onCloseError = (event) => {
        setShowErrorEventUpload(false);
        setErrorEventUpload('');
    }

    const goBackToHome = (event) => {
      navigate('/');
    }


    const disableDates = (dateParam) => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return dateParam < date
    }


    const handleUploadPhotos = async () => {
        const hashedNames = [];
        for ( let i=0; i<photosUpload.length; i++ ){
            hashedNames.push(await handleUploadFirebaseImage(photosUpload[i].name, photosUpload[i]) );
        }
        setPhotosNamesHashed(hashedNames);
        return hashedNames;
    }

    const findDate = (dates, date) => {
        const dateTime = date.getTime();
        return dates.find((item) => item.getTime() === dateTime);
    };

    const findIndexDate = (dates, date) => {
        const dateTime = date.getTime();
        return dates.findIndex((item) => item.getTime() === dateTime);
      };

    const renderPickerDay = (date, selectedDates, pickersDayProps) => {
        if (!eventDates) {
          return <PickersDay {...pickersDayProps} />;
        }
        const dateToCompare = startOfDay(new Date(date.toISOString()));
        const selected = findDate(eventDates, dateToCompare);
    
        return (
          <CustomPickersDay
            {...pickersDayProps}
            disableMargin
            selected={selected}
          />
        );
      };

    const handleChangeDates = (selectedDate) => {
        console.log("AAA");
        const array = [...eventDates];
        const date = startOfDay(new Date(selectedDate.toISOString()));
        const indexElem = findIndexDate(array, date);
        console.log(indexElem);
        if ( indexElem >= 0 ){
            array.splice( indexElem, 1 );
        } else {
            array.push( date );
        }
        setEventDates( array );
    }


  return (
    <>
        <form onSubmit = {onSubmitUpload}>
            <Container id="formWrapper" className="uploadForm">
                <Collapse in={showErrorEventUpload}>
                    <Alert onClose={onCloseError} severity="error" id="AlertError">
                        <AlertTitle><strong>Event Upload Error</strong></AlertTitle>
                            {errorEventUpload}
                    </Alert>
                </Collapse>
                <Container className={"LogoContainer"}>
                    <h1>Upload Your Event</h1>
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Event's Name"
                        type = "text"
                        placeholder = "Event's name"
                        name = "Events_name"
                        className={"inputStyle"}
                        value={eventName}
                        onChange = {(event) => setEventName(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Price"
                        type = "number"
                        placeholder = "Price"
                        name = "Price"
                        className={"inputStyle"}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">U$D</InputAdornment>,
                        }}
                        value={price}
                        onChange = {(event) => setPrice(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Location"
                        type = "text"
                        placeholder = "Location"
                        name = "location"
                        className={"inputStyle"}
                        value={location}
                        onChange = {(event) => setLocation(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <FormControlLabel control={
                        <Checkbox onClick={() => {setHasMaxCapacity(!hasMaxCapacity); setMaxCapacity(null);}}/>
                    } label="Has Max Capacity?" />
                </Container>
                <Container className={"inputClass"}>
                    <FormControlLabel control={
                        <Checkbox onClick={() => {setHasSpecificDates(!hasSpecificDates); setEventDates([]);}}/>
                    } label="Has Specific Dates?" />
                </Container>
                { hasMaxCapacity ? <>
                    <Container className={"inputClass"}>
                        <TextField 
                            label = "Max. Capacity"
                            type = "number"
                            placeholder = "Max. Capacity"
                            name = "max_capacity"
                            className={"inputStyle"}
                            value={maxCapacity ? maxCapacity : ""}
                            onChange = {(event) => setMaxCapacity(event.target.value)}
                        />
                    </Container>
                </> : null
                }
                {hasSpecificDates ?
                <LocalizationProvider  dateAdapter={AdapterDateFns} >
                    <Grid  item container justifyContent="center" alignItems="center" className={"inputClass"} style={{marginTop:"1.5rem"}}>
                        <label><strong>Event's Valid Dates</strong></label>
                    </Grid>
                    <Grid  item container justifyContent="center" alignItems="center" className={"inputClass"}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            id="event_date"
                            label="Event's Dates"
                            inputFormat="DD/MM/YYYY"
                            value={eventDates || []}
                            onChange={handleChangeDates}
                            onSelect={handleChangeDates}
                            style={{margin:"auto"}}
                            shouldDisableDate={disableDates}
                            renderDay={renderPickerDay}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                </LocalizationProvider> : null
                }
                <Container className={"inputClass"}>
                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        name="Description"
                        rows={5}
                        value={description}
                        className={"inputStyle"}
                        onChange = {(event) => setDescription(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"} style={{width:"100%"}}>
                    <Input
                        id="photosInput"
                        label="Upload Photos"
                        name="Upload Photos"
                        value={fileInputShow}
                        className={"inputStyle"}
                        inputProps = {{accept: "image/*", "multiple":true}}
                        type = "file"
                        style={{width:"100%", marginBottom: 10}}
                        onChange = {(event) => {setFileInputShow(event.target.value); setPhotosUpload(event.target.files)}}
                        
                    />
                </Container>
                {loadingAsync ? 
                    <CircularProgress/> : 
                <>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>Upload</Button>
                    </Container>
                    <Container  className={"buttonClass"} maxWidth="sm">
                        <Button type="button" variant="contained" color="error" sx={{fontSize:16}} onClick={goBackToHome}>Cancel</Button>
                    </Container>
                </>
                }
            </Container>
        </form>
    </>
  )
}
