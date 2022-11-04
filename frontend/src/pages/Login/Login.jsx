import React from 'react'
import { Button, Container, IconButton, InputAdornment, TextField, Alert, AlertTitle, Collapse } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const Login = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorLogin, setShowErrorLogin] = useState(false);
    const [errorLogin, setErrorLogin] = useState('');
    const API_URL = 'http://localhost:8000';
    const navigate = useNavigate();

    const onSubmitLogin = async (event) => {
        event.preventDefault();
        const paramsLogin = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        };
        const url = `${API_URL}/login`;
        const response = await fetch(
            url,
            paramsLogin
        );
        const jsonResponse = await response.json();
        if (response.status === 200){
            if(!jsonResponse.status_code){
                localStorage.setItem("sessionToken", true);
                localStorage.setItem("username", JSON.parse(paramsLogin.body).username);
                navigate('/');
            }else{
                setErrorLogin(jsonResponse.detail);
                setShowErrorLogin(true);
            }
        }
    }

    const onPressSignUp = (event) => {
        navigate('/sign-up');
    }

    const toggleSeePassword = (event) => {
        setShowPassword(!showPassword);
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onCloseError = (event) => {
        setShowErrorLogin(false);
        setErrorLogin('');
    }

  return (
    <>
        <form onSubmit = {onSubmitLogin}>
            <Container maxWidth="sm" id="formWrapper">
                <Collapse in={showErrorLogin}>
                    <Alert onClose={onCloseError} severity="error" id="AlertError">
                        <AlertTitle><strong>Login Error</strong></AlertTitle>
                            {errorLogin}
                    </Alert>
                </Collapse>
                <Container className={"LogoContainer"}>
                    <h2>Login</h2>
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
                <Container  className={"buttonClass"} maxWidth="sm">
                    <Button type="submit" variant="contained" sx={{fontSize:16}}>Log In</Button>
                    <Button onClick={onPressSignUp} variant="outlined" sx={{fontSize:16}}>Sign Up</Button>
                </Container>
            </Container>
        </form>
    </>
  )
}
