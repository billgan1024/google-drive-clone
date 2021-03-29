import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import {Link} from "react-router-dom";

//create a navbar which is always expanded (check bootstrap documentation)
export default function NavigationBar({activeKey, fixed}) {
    return (
        <Navbar fixed={fixed} bg="light">
            <Nav activeKey={activeKey}>
                <Nav.Link eventKey="drive" as={Link} to="/drive">
                    Drive
                </Nav.Link>
                <Nav.Link eventKey="profile" as={Link} to="/user">
                    Profile
                </Nav.Link>
            </Nav>
        </Navbar>
    )
}
