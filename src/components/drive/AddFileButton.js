import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useAuth} from "../../contexts/AuthContext";
import React, {useState} from "react";
import ReactDOM from "react-dom";
import {storage, database} from "../../firebase";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import { v4 as uuidv4 } from "uuid";
import { ProgressBar, Toast } from "react-bootstrap";

export default function AddFileButton({currentFolder, setMessage, setShow}) {
    const {currentUser} = useAuth();
    const [uploadingFiles, setUploadingFiles] = useState([]);
    
    function handleUpload(e) {
        setShow(false);
        const file = e.target.files[0];
        if(currentFolder == null || file == null) return;
        
        //console.log(currentFolder.path);
        //append a new object to the uploading files state
        const id = uuidv4();
        setUploadingFiles(prevUploadingFiles => [
            ...prevUploadingFiles,
            {id: id, name: file.name, progress: 0, error: false}
        ])
        console.log(uploadingFiles);

        //upload to firebase storage on a path if it's not in the root folder, otherwise just use the file name
        const filePath = currentFolder === ROOT_FOLDER ? 
            `${currentFolder.path.join("/")}/${file.name}` : 
            `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`;
        const uploadTask = storage.ref(`/files/${currentUser.uid}/${filePath}`).put(file);

        uploadTask.on("state_changed", snapshot => {
            //track progress (this always executes as the file is uploaded)
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;
            setUploadingFiles(prevUploadingFiles => {
                //update the current file progress in the array
                return prevUploadingFiles.map(uploadFile => {
                    if(uploadFile.id === id) {
                        return {...uploadFile, progress: progress};
                    }
                    return uploadFile;
                })
            })
        }, () => {  
            //handle errors
            setUploadingFiles(prevUploadingFiles => {
                return prevUploadingFiles.map(uploadFile => {
                    //set error of this file to true
                    if(uploadFile.id === id) {
                        return {...uploadFile, error: true};
                    }
                    return uploadFile;
                })
            })
        }, () => {
            //upload this to the database once it finishes (remove it from uploading files)
            setUploadingFiles(prevUploadingFiles => {
                return prevUploadingFiles.filter(uploadFile => {
                    return uploadFile.id !== id;
                })
            })
            console.log(uploadingFiles);
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                //handle duplicates
                database.files.where("name", "==", file.name)
                .where("userId", "==", currentUser.uid)
                .where("folderId", "==", currentFolder.id).get().then(existingFiles => {
                    const existingFile = existingFiles.docs[0];
                    if(existingFile) {
                        //update the dl link to this new url
                        existingFile.ref.update({url: url});
                        setMessage("A duplicate file name was found, so it has been replaced with the uploaded file.");
                        setShow(true);
                        setTimeout(() => {
                            setShow(false);
                        }, 5000);
                    } else {
                        //add a new file
                        database.files.add({
                            url: url,
                            name: file.name,
                            createdAt: database.getCurrentTimestamp(),
                            folderId: currentFolder.id,
                            userId: currentUser.uid
                        });
                    }
                });
            });
        });
        //reset event
        e.target.value = "";
    }
    //wrap an invisible input on a label button so that the label = file input
    return (
        <>
        <label className="btn btn-outline-success btn-md m-0 mr-2">
            <FontAwesomeIcon icon={faFileUpload}/>
            <input type="file" onChange={handleUpload} style={{opacity: 0, position: "absolute", left: "-9999px"}}/>
        </label>
        {uploadingFiles.length > 0 && ReactDOM.createPortal(
            <div style={{position: "absolute", bottom: "1rem", right: "1rem", maxWidth: 400 }}>
                {uploadingFiles.map(file => (
                    <Toast key={file.id} onClose={() => {
                        setUploadingFiles(prevUploadingFiles => {
                            return prevUploadingFiles.filter(uploadFile => {
                                return uploadFile.id !== file.id;
                            })
                        })
                    }}>
                        <Toast.Header closeButton={file.error} className="text-truncate w-100 d-block">{`Uploading ${file.name}`}</Toast.Header>
                        <Toast.Body>
                            <ProgressBar animated={!file.error} variant={file.error ? "danger" : "primary"} 
                            now={file.error ? 100 : file.progress*100} 
                            label={file.error ? "Error uploading file. Please try again later." : `${Math.round(file.progress*100)}%`}/>
                        </Toast.Body>
                    </Toast>
                ))}
            </div>,
            document.body)}
        </>
    )
}
