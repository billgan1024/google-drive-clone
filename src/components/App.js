import React from "react";
import Signup from "./Signup";
import {Container} from "react-bootstrap";
import vid from "../assets/video.mp4";
import "../index.css";
import {AuthProvider} from "../contexts/AuthContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";

export function parseError(e) {
	switch(e.code.replace("auth/", "")) {
		case "weak-password": return "Password must be at least 6 characters in length."; break;
		case "invalid-email": return "Invalid email address."; break;
		case "user-not-found": return "Invalid email address or password."; break;
		case "wrong-password": return "Invalid email address or password."; break;
		default: return e.message; break;
	}
}

function App() {
	return (
		<>
		<video className="background-video" autoPlay loop muted>
			<source src={vid} type='video/mp4' />
		</video>
		<Container className="d-flex align-items-center justify-content-center" style={{minHeight:"100vh"}}>
			<div className="w-100" style={{zIndex: 1, maxWidth: "400px"}}>
				<Router>
					<AuthProvider>
						<Switch>
							<PrivateRoute exact path="/" component={Dashboard}/>
							<PrivateRoute path="/change-password" component={ChangePassword}/>
							<Route path="/signup" component={Signup}/>
							<Route path="/login" component={Login}/>
							<Route path="/forgot-password" component={ForgotPassword}/>
						</Switch>
					</AuthProvider>
				</Router>
			</div>
		</Container>
		</>
	)
}

export default App;