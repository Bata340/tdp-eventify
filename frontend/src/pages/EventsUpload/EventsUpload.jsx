import { Button, Container, TextField, Alert, AlertTitle, Collapse, Input, CircularProgress  } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleUploadFirebaseImage, deleteFirebaseImage } from '../../common/FirebaseHandler';


export const EventsUpload = (props) => {

    const [price, setPrice] = useState(0);
    const [eventName, setEventName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [photosNamesHashed, setPhotosNamesHashed] = useState([]);
    const [photosUpload, setPhotosUpload] = useState([]);
    const [fileInputShow, setFileInputShow] = useState("");
    const [showErrorEventUpload, setShowErrorEventUpload] = useState(false);
    const [errorEventUpload, setErrorEventUpload] = useState('');
    const [loadingAsync, setLoadingAsync] = useState(false);
    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

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

    const handleUploadPhotos = async () => {
        const hashedNames = [];
        for ( let i=0; i<photosUpload.length; i++ ){
            hashedNames.push(await handleUploadFirebaseImage(photosUpload[i].name, photosUpload[i]) );
        }
        setPhotosNamesHashed(hashedNames);
        return hashedNames;
    }

  return (
    <>
        <form onSubmit = {onSubmitUpload}>
            <Container maxWidth="sm" id="formWrapper">
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
