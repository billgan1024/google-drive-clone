import React, {useState} from "react";
import {Button, Modal, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons";
import {database} from "../../firebase";
import {useAuth} from "../../contexts/AuthContext";
import {ROOT_FOLDER} from "../../hooks/useFolder";

//opens a modal for uploading a file into the current folder
//this button already knows its current Folder location, so when a new folder is created, the parent id of that folder
//will be this current folder.
export default function AddFolderButton({currentFolder}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const {currentUser} = useAuth();

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false); setName("");
    }

    function handleSubmit(e) {
        e.preventDefault();

        if(currentFolder == null) return;
        const path = [...currentFolder.path];
        if(currentFolder !== ROOT_FOLDER) {
            path.push({name: currentFolder.name, id: currentFolder.id});
        }

        //create a folder in the database
        //pass in user id so that the user only sees files that they created
        //append to the currentFolder's path so that the breadcrumb has ez data
        database.folders.add({
            name: name,
            parentId: currentFolder.id,
            userId: currentUser.uid,
            path: path,
            createdAt: database.getCurrentTimestamp()
        });
        setOpen(false); setName("");
    }

    return (
        <>
        <Modal show={open} onHide={closeModal}>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Folder name</Form.Label>
                        <Form.Control type="text" required value={name} onChange={e => setName(e.target.value)}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                    <Button variant="success" type="submit">Add folder</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        <Button onClick={openModal} variant="outline-success" className="m-10" size="md">
            <FontAwesomeIcon icon={faFolderPlus}/>
        </Button>
        </>
    )
}
