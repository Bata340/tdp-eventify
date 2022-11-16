import React from "react";
import { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import "./Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';



function isLoggedIn(){
    return (
        localStorage.getItem("sessionToken") !== undefined 
            && localStorage.getItem("sessionToken") !== null
    );
}



export const NavBar = () => {

    const [isLoggedInSt, setIsLoggedInSt] = useState(isLoggedIn());
    const [money, setMoney] = useState(0);
    const API_URL = 'http://localhost:8000';


    function logout(){
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        setIsLoggedInSt(false);
        window.location.reload();
    }


    useEffect(() => {
        const handleStorage = () => {
            setIsLoggedInSt(isLoggedIn());
        }

        const retrieveMoney = async () => {
            const paramsGet = {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            const url = `${API_URL}/users/${localStorage.getItem("username")}`;
            const response = await fetch(
                url,
                paramsGet
            );
            const jsonResponse = await response.json();
            if (response.status === 200){
                if(!jsonResponse.status_code){
                    setMoney(jsonResponse.message.money);
                }
            }
        }

        setIsLoggedInSt(isLoggedIn());
        if(isLoggedInSt){
            retrieveMoney();
        }
    
        window.addEventListener('storage', handleStorage);
        window.addEventListener('payment', retrieveMoney);
        return () => {
            window.removeEventListener('storage', handleStorage); 
            window.removeEventListener('payment', retrieveMoney);
        };
    }, []);


	return (
		<div className="fixed-top">
            <Navbar className = "bg-color_custom_nav" expand="lg">
                <Navbar.Brand className="mx-3" href="/">
                    <img src="/logo.png" height="65px" alt="logo-home" id="image_logo"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{marginRight:'2rem'}}/>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {isLoggedIn() && <>
                        <NavDropdown
                        className="mx-3"
                        title="Events"
                        id="dropdown_eventos"
                        >
                            <NavDropdown.Item href="/events/add" className="eventItem">
                                Add an Event
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/events/admin-my-events" className="eventItem">
                                Manage My Events
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/my-events" className="eventItem">
                                Manage My Schedule
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/events/payments-received" className="eventItem">
                                Watch My Payments
                            </NavDropdown.Item>
                        </NavDropdown>
                    
                        <NavDropdown
                        className="mx-3"
                        title="Friends"
                        id="dropdown_friends"
                        >
                            <NavDropdown.Item href="/experiences/add" className="friendsItem">
                                Add A Friend
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/experiences/admin-my-experiences" className="friendsItem">
                                Manage My Friends
                            </NavDropdown.Item>
                        </NavDropdown> </>
                    }
                </Nav>
                <Nav className="ms-auto">
                    {isLoggedInSt ? 
                        <>
                            <p id="money-navbar">Amount: U$D {money}</p>
                            <Button id="button-logout" variant="danger" onClick = {logout}>
                                <strong>Logout</strong>
                            </Button> 
                        </>
                        :
                        <Button id="button-login" variant="primary" href="/login">
                            <strong>Login</strong>
                        </Button>
                    }
                </Nav>
                </Navbar.Collapse>
            </Navbar>
		</div>
	);
}