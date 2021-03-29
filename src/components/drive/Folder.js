import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolder} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

//takes in a folder that we want to render
//renders the button and truncates text if it's too long
//includes a link to go to the folder (react router handles this)
export default function Folder({folder}) {
    return (
        <Button to={{
            pathname: `/drive/folder/${folder.id}`,
            state: {folder: folder}
        }} variant="outline-light" className="text-truncate w-100" as={Link}>
            <FontAwesomeIcon icon={faFolder} className="mr-2"/>
            {folder.name}
        </Button>
    )
}
