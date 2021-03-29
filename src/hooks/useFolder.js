import {useReducer, useEffect} from "react";
import {useAuth} from "../contexts/AuthContext";
import {database} from "../firebase";
import {useHistory} from "react-router-dom";

const ACTIONS = {
    SELECT_FOLDER: "select-folder",
    UPDATE_FOLDER: "update-folder",
    SET_CHILD_FOLDERS: "set-child-folders",
    SET_CHILD_FILES: "set-child-files"
}

//root folder is a fake folder
export const ROOT_FOLDER = {name: "Root", id: null, path: []};

function reducer(state, {type, payload}) {
    switch(type) {
        case ACTIONS.SELECT_FOLDER:
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFolders: [],
                childFiles: []
            };
        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder
            };
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders
            };
        case ACTIONS.SET_CHILD_FILES:
            return {
                ...state,
                childFiles: payload.childFiles
            }
        default:
            return state;
    }
}

//this manages the current folder throughout the whole application
export function useFolder(folderId = null, folder = null) {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
    });

    const {currentUser} = useAuth();
    const history = useHistory();

    //run dispatch() every time the folderId or folder changes
    useEffect(() => {
        dispatch({type: ACTIONS.SELECT_FOLDER, payload: {folderId, folder}});
    }, [folderId, folder])

    useEffect(() => {
        if(folderId == null) {
            //go back to the root folder and exit
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: {folder: ROOT_FOLDER}
            });
        }
        
        //when we have a folder id, update the folder object by getting it from the firebase database
        //also format the folder into a usable object
        database.folders.doc(folderId).get().then(doc => {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: {folder: database.formatDoc(doc)}
            });
        }).catch((e) => {
            console.error(e);
            //go back to the drive page if this folderId is invalid
            /*dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: {folder: ROOT_FOLDER}
            });*/
            history.push("/drive");
        });

    }, [folderId, history]);

    //run every time the current folder id changes (update child folders)
    useEffect(() => {
        //check whether the parent id == folderId
        return database.folders
            .where("parentId", "==", folderId)
            .where("userId", "==", currentUser.uid)
            .orderBy("createdAt")
            .onSnapshot(snapshot => {
                dispatch({
                    type: ACTIONS.SET_CHILD_FOLDERS,
                    payload: { childFolders: snapshot.docs.map(database.formatDoc) }
                })
            });
    }, [folderId, currentUser]);

    useEffect(() => {
        //check whether the parent id == folderId
        return database.files
            .where("folderId", "==", folderId)
            .where("userId", "==", currentUser.uid)
            //.orderBy("createdAt")
            .onSnapshot(snapshot => {
                dispatch({
                    type: ACTIONS.SET_CHILD_FILES,
                    payload: { childFiles: snapshot.docs.map(database.formatDoc) }
                })
            });
    }, [folderId, currentUser]);
    return state;
}