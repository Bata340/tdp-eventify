import { Button, Container, TextField, Alert, AlertTitle, Collapse, 
    CircularProgress, Grid, Input, FormControlLabel, Checkbox, 
    Accordion, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleUploadFirebaseImage, deleteFirebaseImage } from '../../common/FirebaseHandler';
import { PhotoEvent } from './PhotoEvent';
import { StaticDatePicker, PickersDay } from '@mui/x-date-pickers';
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import startOfDay from "date-fns/startOfDay";


export const EventsEdit = (props) => {

    const [searchParams] = useSearchParams();
    const [price, setPrice] = useState(0);
    const [eventName, setEventName] = useState('');
    const [location, setLocation] = useState('');
    const [hasMaxCapacity, setHasMaxCapacity] = useState(false);
    const [hasSpecificDates, setHasSpecificDates] = useState(false);
    const [maxCapacity, setMaxCapacity] = useState(null);
    const [eventDates, setEventDates] = useState([]);
    const [description, setDescription] = useState('');
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [photosUpload, setPhotosUpload] = useState([]);
    const [fileInputShow, setFileInputShow] = useState("");
    const [showErrorEventEdit, setShowErrorEventEdit] = useState(false);
    const [erorEventEdit, setErrorEventEdit] = useState('');
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

    const disableDates = (dateParam) => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return dateParam < date
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
        const array = [...eventDates];
        const date = startOfDay(new Date(selectedDate.toISOString()));
        const indexElem = findIndexDate(array, date);
        if ( indexElem >= 0 ){
            array.splice( indexElem, 1 );
        } else {
            array.push( date );
        }
        setEventDates( array );
    }


    const onSubmitEdit = async (event) => {
        event.preventDefault();
        setLoadingAsync(true);
        let photosNames = await handleUploadPhotos();
        const paramsUpload = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: eventName,
                price: price,
                description: description,
                location: location,
                photos: photosNames,
                maxAvailability: maxCapacity,
                eventDates: eventDates
            })
        };
        const url = `${API_URL}/event/${searchParams.get("id")}`;
        const response = await fetch(
            url,
            paramsUpload
        );
        const jsonResponse = await response.json();
        setLoadingAsync(false);
        if (response.status === 200){
            if(!jsonResponse.status_code){
                navigate('/events/admin-my-events');
                window.location.reload();
            }else{
                setErrorEventEdit(jsonResponse.detail);
                setShowErrorEventEdit(true);
            }
        }
    }

    const onCloseError = (event) => {
        setShowErrorEventEdit(false);
        setErrorEventEdit('');
    }

    const goBackToHome = (event) => {
      navigate('/');
    }

    const onRemoveImage = async( nameImage ) => {
        const paramsDelete = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
          };
          const url = `${API_URL}/event/${searchParams.get("id")}/photos/${nameImage}`;
          const response = await fetch(
              url,
              paramsDelete
          );
          const jsonResponse = await response.json();
          if (response.status === 200){
              if(!jsonResponse.status_code){
                await deleteFirebaseImage( `files/${nameImage}` );
                setPhotosNamesHashed( photosNamesHashed.filter( element => element !== nameImage ) );
              }
          }
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
                setPrice(jsonResponse.message.price);
                setEventName(jsonResponse.message.name);
                setLocation(jsonResponse.message.location);
                setDescription(jsonResponse.message.description);
                setPhotosNamesHashed(jsonResponse.message.photos);
                if(jsonResponse.message.eventDates.length > 0){
                    const arrayToUse = [];
                    for (let i=0; i<jsonResponse.message.eventDates.length; i++){
                        const date = new Date(jsonResponse.message.eventDates[i]);
                        arrayToUse.push(date);
                    }
                    setHasSpecificDates(true);
                    setEventDates(arrayToUse);
                }
                if(jsonResponse.message.maxAvailability !== null){
                    setHasMaxCapacity(true);
                    setMaxCapacity(jsonResponse.message.maxAvailability);
                }
            }else{
                setErrorEventEdit(jsonResponse.detail);
                setShowErrorEventEdit(true);
            }
        }
    }

    useEffect(() => {
        getDataForFields(searchParams.get("id"));
    //eslint-disable-next-line
    }, []);

    const handleUploadPhotos = async () => {
        const hashedNames = photosNamesHashed;
        for ( let i=0; i<photosUpload.length; i++ ){
            hashedNames.push(await handleUploadFirebaseImage(photosUpload[i].name, photosUpload[i]) );
        }
        setPhotosNamesHashed(hashedNames);
        return hashedNames;
    }

  return (
    <>
        <form onSubmit = {onSubmitEdit}>
            <Container maxWidth="sm" id="formWrapper">
                <Collapse in={showErrorEventEdit}>
                    <Alert onClose={onCloseError} severity="error" id="AlertError">
                        <AlertTitle><strong>Event Edition Error</strong></AlertTitle>
                            {erorEventEdit}
                    </Alert>
                </Collapse>
                <Container className={"LogoContainer"}>
                    <h1>Edit Your Event</h1>
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Event's Name"
                        type = "text"
                        placeholder = "Event's name"
                        name = "events_name"
                        className={"inputStyle"}
                        value={eventName}
                        onChange = {(event) => setEventName(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Price Per Day (U$D)"
                        type = "number"
                        placeholder = "Price Per Day (U$D)"
                        name = "Price Per Day"
                        className={"inputStyle"}
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
                        <Checkbox 
                            onClick={() => {setHasMaxCapacity(!hasMaxCapacity); setMaxCapacity(null);}}
                            checked = {hasMaxCapacity}
                        />
                    } label="Has Max Capacity?" />
                </Container>
                <Container className={"inputClass"}>
                    <FormControlLabel control={
                        <Checkbox 
                            checked = {hasSpecificDates}
                            onClick={() => {setHasSpecificDates(!hasSpecificDates); setEventDates([]);}}
                        />
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
                            value={eventDates}
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
                <Accordion style={{marginTop:"1rem"}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography>Images - {photosNamesHashed.length} Elements</Typography>
                    </AccordionSummary>
                    <Grid container spacing={2}>
                        {
                            photosNamesHashed.map((value) => {
                                return(
                                <Grid key={value} item xs={12} md={12} lg={6}>
                                    <PhotoEvent nameImage={value} onRemoveImage = {onRemoveImage}/>
                                </Grid>
                                );
                            })
                        }
                    </Grid>
                </Accordion>
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
                        <Button type="submit" variant="contained" sx={{fontSize:16}}>Save Changes</Button>
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