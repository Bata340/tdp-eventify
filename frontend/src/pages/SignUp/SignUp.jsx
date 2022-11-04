import React from 'react'
import { Button, Container, IconButton, InputAdornment, TextField, Alert, AlertTitle, Collapse } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

export const SignUp = (props) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorSignUp, setShowErrorSignUp] = useState(false);
    const [errorSignUp, setErrorSignUp] = useState('');
    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmitSignUp = async (event) => {
        event.preventDefault();
        if(!birthDate){
            return;
        }
        const paramsRegister = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                first_name: firstName,
                last_name: lastName,
                birth_date: birthDate.toISOString().substr(0,10),
                phone_number: phoneNumber,
                location: location,
                login: true
            })
        };
        const url = `${API_URL}/register`;
        const response = await fetch(
            url,
            paramsRegister
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                localStorage.setItem("sessionToken", true);
                localStorage.setItem("username", JSON.parse(paramsRegister.body).username);
                navigate('/');
                window.location.reload();
            }else{
                setErrorSignUp(jsonResponse.detail);
                setShowErrorSignUp(true);
            }
        }
    }

    const toggleSeePassword = (event) => {
        setShowPassword(!showPassword);
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onCloseError = (event) => {
        setShowErrorSignUp(false);
        setErrorSignUp('');
    }

  return (
    <>
        <form onSubmit = {onSubmitSignUp}>
            <Container maxWidth="sm" id="formWrapper">
                <Collapse in={showErrorSignUp}>
                    <Alert onClose={onCloseError} severity="error" id="AlertError">
                        <AlertTitle><strong>SignUp Error</strong></AlertTitle>
                            {errorSignUp}
                    </Alert>
                </Collapse>
                <Container className={"LogoContainer"}>
                    <h2>Sign Up</h2>
                    <img src="/logo.png" alt="Logo FiubAirBnb" style={{width:150}}/>
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Username"
                        type = "text"
                        placeholder = "Username"
                        name = "username"
                        className={"inputStyle"}
                        value={username}
                        onChange = {(event) => setUsername(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Password"
                        type = {showPassword?"text":"password"}
                        placeholder = "Password"
                        name = "password"
                        value={password}
                        onChange = {(event) => setPassword(event.target.value)}
                        className={"inputStyle"}
                        InputProps = {{
                            endAdornment: 
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={toggleSeePassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "First Name"
                        type = "text"
                        placeholder = "First Name"
                        name = "first_name"
                        className={"inputStyle"}
                        value={firstName}
                        onChange = {(event) => setFirstName(event.target.value)}
                    />
                </Container>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Last Name"
                        type = "text"
                        placeholder = "Last Name"
                        name = "lastname"
                        className={"inputStyle"}
                        value={lastName}
                        onChange = {(event) => setLastName(event.target.value)}
                    />
                </Container>
                <LocalizationProvider  dateAdapter={AdapterDayjs } >
                    <Container className={"inputClass"}>
                    
                        <DatePicker
                            id="birth_date"
                            label="Birth Date"
                            inputFormat="DD/MM/YYYY"
                            value={birthDate || null}
                            onChange={(event) => setBirthDate(event)}
                            className={"inputStyle"}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Container>
                </LocalizationProvider>
                <Container className={"inputClass"}>
                    <TextField 
                        label = "Phone Number"
                        type = "number"
                        placeholder = "Phone Number"
                        name = "phone_number"
                        className={"inputStyle"}
                        value={phoneNumber}
                        onChange = {(event) => setPhoneNumber(event.target.value)}
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
                <Container  className={"buttonClass"} maxWidth="sm">
                    <Button type="submit" variant="contained" sx={{fontSize:16}}>Sign Up</Button>
                </Container>
                <Container  className={"buttonClass"} maxWidth="sm">
                    <a href='/'>Already have an account?</a>
                </Container>
            </Container>
        </form>
    </>
  )
}
