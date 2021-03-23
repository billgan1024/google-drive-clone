import React, {useRef, useState} from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {useAuth} from "../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";

export default function Signup() {
    //use refs for data
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    //pull the signup function from useAuth as well as current user data
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    //handle sign up submit button
    async function handleSubmit(e) {
        e.preventDefault();
        //check if passwords are the same
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            //exit function 
            return setError("Passwords do not match.");
        }
        try {
            setError("");
            setLoading(true);
            //login using input data
            await signup(emailRef.current.value, passwordRef.current.value);
            //go to the dashboard
            history.push("/");
        } catch(e) {
            console.log(e);
            setError("Failed to create an account.");
        }
        setLoading(false);
    }
    return (
        <>
            <h2 className="text-center mb-4" style={{color: "white"}}>Sign up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label style={{color: "white"}}>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>
                <Form.Group id="password">
                    <Form.Label style={{color: "white"}}>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} style={{fontFamily: "Calibri"}} required/>
                </Form.Group>
                <Form.Group id="password-confirm">
                    <Form.Label style={{color: "white"}}>Confirm Password</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} style={{fontFamily: "Calibri"}}  required/>
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">Sign up</Button>
            </Form>
            <div className="w-100 text-center mt-2" style={{color: "white"}}>
                Already have an account? <Link to="/login" style={{textDecoration: "none"}}>Log in</Link>
            </div>
        </>
    )
}
