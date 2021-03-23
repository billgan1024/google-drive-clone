import React, {useRef, useState} from "react";
import { Form, Button,  Alert } from "react-bootstrap";
import {useAuth} from "../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";

export default function Login() {
    //use refs for data
    const emailRef = useRef();
    const passwordRef = useRef();
    //pull the signup function from useAuth as well as current user data
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    //handle sign up submit button
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            //go to the dashboard
            history.push("/");
        } catch(e) {
            console.log(e);
            setError("Failed to log in.");
        }
        setLoading(false);
    }
    return (
        <>
            <h2 className="text-center mb-4" style={{color: "white"}}>Log in</h2>
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
                <Button disabled={loading} className="w-100" type="submit">Log in</Button>
            </Form>
            <div className="w-100 text-center mt-2" style={{color: "white"}}>
                <Link to="/forgot-password" style={{textDecoration: "none"}}>Forgot Password?</Link>
            </div>
            <div className="w-100 text-center mt-2" style={{color: "white"}}>
                Don't have an account? <Link to="/signup" style={{textDecoration: "none"}}>Sign up</Link>
            </div>
        </>
    )
}
