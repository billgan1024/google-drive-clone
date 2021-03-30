import React, {useState} from "react";
import NavigationBar from "../NavigationBar";
import AddFolderButton from "./AddFolderButton";
import AddFileButton from "./AddFileButton";
import {Container, Alert} from "react-bootstrap";
import {ROOT_FOLDER, useFolder} from "../../hooks/useFolder";
import Folder from "./Folder";
import {useParams, useLocation} from "react-router-dom";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import File from "./File";
import { Img } from "../App";

export default function Dashboard() {
    //get folderId from the actual website link to query the database for this specific folder (check App.js)
    const {folderId} = useParams();
    //state is obtained via useLocation which grabs it from the 'to' prop 
    //note: whenever you reach another path, folder, childFolders, and childFiles get pulled again 
    
    //use state given by the link object pushed by to={object} or history.push({object}) to preload the new path
    //by default, it's the root folder
    const {state = {}} = useLocation();
    const {folder, childFolders, childFiles} = useFolder(folderId, state.folder);
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    
    console.log(childFolders);
    return (
        <>
            <Img/>
            <NavigationBar activeKey="drive"/>
            <Container fluid style={{color: "white"}}>
                <div className="d-flex align-items-center" style={{margin: 10}}>
                    <FolderBreadcrumbs currentFolder={folder}/>
                    {/*addFolder will create a new folder and set the parent id to currentFolder*/}
                    <AddFileButton currentFolder={folder} setMessage={setMessage} setShow={setShow}/>
                    <AddFolderButton currentFolder={folder}/>
                </div>
                <div className="d-flex flex-wrap">
                    {
                        childFolders.length > 0 ? (
                        //render all the child folders from this folder
                        childFolders.map(childFolder => (
                            <div key={childFolder.id} style={{maxWidth: 400}} className="p-2">
                                <Folder folder={childFolder}/>
                            </div>
                        ))) : <p style={{margin: 0}}>There are no folders in this directory.</p>
                    }
                </div>
                <hr style={{backgroundColor: "white", height: 1, border: 0}}/>
                <div className="d-flex flex-wrap">
                    {
                        childFiles.length > 0 ? (
                        //render all the child folders from this folder
                        childFiles.map(childFile => (
                            <div key={childFile.id} style={{maxWidth: 400}} className="p-2">
                                <File file={childFile}/>
                            </div>
                        ))) : <p style={{margin: 0}}>There are no files in this directory.</p>
                    }
                </div>
            </Container>
            <Alert show={show} style={{position: "fixed", bottom: 0, left: 0, margin: 10}} variant="info">{message}</Alert>
        </>
    )
}
