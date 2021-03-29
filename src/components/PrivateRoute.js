import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

//wrapper for a route; only renders the route data if a user is signed in, otherwise it redirects them to the login page
//use this for the dashboard and the update profile page
export default function PrivateRoute({children, component: Component, ...rest}) {
    const {currentUser} = useAuth();
    return (
        <Route
            {...rest}
            render={props => {
                return currentUser ? <Component {...props}/> : <Redirect to="/login"/>
            }}
        >{children}</Route>
    )
}
