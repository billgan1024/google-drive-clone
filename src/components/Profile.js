import React, {useState} from "react";
import {Card, Button, Alert} from "react-bootstrap";
import {useAuth} from "../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";
import {Img, parseError} from "./App";
import CenteredContainer from "./CenteredContainer";
import NavigationBar from "./NavigationBar";

export default function Profile() {
    const [error, setError] = useState("");
    const {currentUser, logout} = useAuth();
    const history = useHistory();
    
    async function handleLogout() {
        setError("");
        try {
            await logout();
            history.push("/login");
        } catch(e) {
            console.log(e);
            setError(parseError(e));
        }
    }
    return (
        <>
        <Img/>
        <NavigationBar activeKey="profile" fixed="top"/>
        <CenteredContainer>
        <Card>
            <Card.Body>
                <h3 className="text-center mb-4">Profile</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <strong>Email: </strong> {currentUser.email}
                <Link to="/change-password" className="btn btn-primary w-100 mt-3">Change Password</Link>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2" style={{color: "white"}}>
            <Button variant="danger" onClick={handleLogout}>Log out</Button>
        </div>
        </CenteredContainer>
        </>
    )
}
