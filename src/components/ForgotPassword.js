import React, {useRef, useState} from "react";
import { Form, Button,  Alert } from "react-bootstrap";
import {useAuth} from "../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";

export default function ForgotPassword() {
    //use refs for data
    const emailRef = useRef();
    //pull the signup function from useAuth as well as current user data
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    //handle sign up submit button
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError(""); setMessage("");
            setLoading(true);
            //reset password
            await resetPassword(emailRef.current.value);
            setMessage("A password reset email has been sent.");
        } catch(e) {
            console.log(e);
            setError("Failed to reset password.");
        }
        setLoading(false);
    }
    return (
        <>
            <h2 className="text-center mb-4" style={{color: "white"}}>Reset Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label style={{color: "white"}}>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">Reset Password</Button>
            </Form>
            <div className="w-100 text-center mt-2" style={{color: "white"}}>
                <Link to="/login" style={{textDecoration: "none"}}>Log in</Link>
            </div>
            <div className="w-100 text-center mt-2" style={{color: "white"}}>
                Don't have an account? <Link to="/signup" style={{textDecoration: "none"}}>Sign up</Link>
            </div>
        </>
    )
}
