import { Login, SignUp, Events, EventsUpload, EventView, MyEvents } from '../pages';
import { NavBar } from '../common/Navbar/Navbar';
import{ BrowserRouter as Router, Routes as Switch, Route } from 'react-router-dom';
import '../common/common.css';

function ReactRoutes() {
	return (
		<>
			<br/>
			<br/>
			<br/>
			<br/>
			<NavBar/>
			<Router style={{marginBottom:30}}>
				<Switch>
					<Route exact path="/" element={<Events/>}/>
					<Route exact path="/events/add" element={<EventsUpload/>}/>
					<Route exact path="/events/admin-my-events" element={<MyEvents/>}/>
					<Route exact path="/event" element={<EventView/>}/>
					<Route exact path="/login" element={<Login/>}/>
					<Route exact path="/sign-up" element={<SignUp/>}/>
				</Switch>
			</Router>
		</>
	);
}


export default ReactRoutes;
