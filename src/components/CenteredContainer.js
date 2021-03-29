import React from "react";
import {Container} from "react-bootstrap";

//renders everything in a centered component (use for profile, sign in, and the like)
export default function CenteredContainer({children}) {
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
            <div className="w-100" style={{maxWidth: "400px"}}>
                {children}
            </div>
        </Container>
    )
}
