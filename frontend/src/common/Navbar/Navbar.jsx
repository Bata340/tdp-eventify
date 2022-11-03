import React from "react";

import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import "./Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function logout(){
	localStorage.removeItem("sessionToken");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    window.location.reload();
}

function isLoggedIn(){
    return (
        localStorage.getItem("sessionToken") !== undefined 
            && localStorage.getItem("sessionToken") !== null
    );
}

export const NavBar = () => {
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
                    {isLoggedIn() ? 
                        <Button id="button-logout" variant="danger" onClick = {logout}>
                            <strong>Logout</strong>
                        </Button>
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