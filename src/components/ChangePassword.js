import React, {useRef, useState} from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {useAuth} from "../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";
import {parseError} from "./App";

export default function ChangePassword() {
    //use refs for data
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    //pull the signup function from useAuth as well as current user data
    const { updatePassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    //handle sign up submit button
    async function handleSubmit(e) {
        e.preventDefault();
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            //exit function 
            return setError("Passwords do not match.");
        }   
        try {
            setError("");
            setLoading(true);
            await updatePassword(passwordRef.current.value);
            setMessage("Password has been changed.");
        } catch(e) {
            console.log(e);
            setError(parseError(e));
        }
        setLoading(false);
    }
    return (
        <>
            <h2 className="text-center mb-4" style={{color: "white"}}>Change Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="password">
                    <Form.Label style={{color: "white"}}>New password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} style={{fontFamily: "Calibri"}} required/>
                </Form.Group>
                <Form.Group id="password-confirm">
                    <Form.Label style={{color: "white"}}>Confirm new password</Form.Label>
                    <Form.Control type="password" ref={passwordConfirmRef} style={{fontFamily: "Calibri"}} required/>
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit">Update</Button>
            </Form>
            <div className="w-100 text-center mt-2" style={{color: "white"}}>
                <Link to="/" disabled={loading} style={{textDecoration: "none"}}>Return to Profile</Link>
            </div>
        </>
    )
}
