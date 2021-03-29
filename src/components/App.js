import React from "react";
import vid from "../assets/video.mp4";
import pic from "../assets/pic.png";
import "../index.css";
import {AuthProvider} from "../contexts/AuthContext";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {useLocation} from "react-router-dom";
import Profile from "./Profile";
import Signup from "./Signup";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";
import Dashboard from "./drive/Dashboard";
import NotFound from "./NotFound";

export function parseError(e) {
	switch(e.code.replace("auth/", "")) {
		case "weak-password": return "Password must be at least 6 characters in length.";
		case "invalid-email": return "Invalid email address.";
		case "user-not-found": return "Invalid email address.";
		case "wrong-password": return "Invalid password.";
		default: return e.message;
	}
}

export function Vid() {
	return (
		<video className="background" autoPlay loop muted style={{zIndex: -1}}>
			<source src={vid} type="video/mp4"/>
		</video>
	)
}

export function Img() {
	return (
		<img className="background" src={pic} style={{zIndex: -1}}/>
	)
}

function App() {
	return (
		<>
		<Router>
			<AuthProvider>
				<Switch>
					{/* Redirects user to the drive if they're signed in, otherwise redirects user to the login page*/}
					<Route exact path="/"> 
						<Redirect to="/drive"/>
					</Route>

					{/* Drive 
					Note: the drive and drive folder path is exact since we don't want incorrect link matching
					Also use dynamic links*/}
					<PrivateRoute exact path="/drive" component={Dashboard}></PrivateRoute>
					<PrivateRoute exact path="/drive/folder/:folderId" component={Dashboard}></PrivateRoute>

					{/* Profile */}
					<PrivateRoute path="/user" component={Profile}></PrivateRoute>
					<PrivateRoute path="/change-password" component={ChangePassword}></PrivateRoute>

					{/* Authentication */}
					<Route path="/signup" component={Signup}></Route>
					<Route path="/login" component={Login}></Route>
					<Route path="/forgot-password" component={ForgotPassword}></Route>

					{/* Not Found */}
					<Route component={NotFound}></Route>
				</Switch>
			</AuthProvider>
		</Router>
		</>
	)
}

export default App;