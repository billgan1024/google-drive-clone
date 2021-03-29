import React from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Img} from "./App";
import CenteredContainer from "./CenteredContainer";
import NavigationBar from "./NavigationBar";

export default function NotFound() {
    return (
        <>
        <Img/>
        <NavigationBar fixed="top"/>
        <CenteredContainer>
        <Card>
            <Card.Body>
                <h3 className="text-center mb-4">Page not found</h3>
                The requested page does not exist.
                <Link to="/drive" className="btn btn-primary w-100 mt-3">Return to Drive</Link>
            </Card.Body>
        </Card>
        </CenteredContainer>
        </>
    )
}
