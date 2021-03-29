import React from "react";
import {Breadcrumb} from "react-bootstrap";
import {ROOT_FOLDER} from "../../hooks/useFolder";
import {Link} from "react-router-dom";

export default function FolderBreadcrumbs({currentFolder}) {
    //get the path to render
    let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
    if(currentFolder) path = [...path, ...currentFolder.path];

    return <Breadcrumb className="flex-grow-1" listProps={{className:"bg-transparent p-0 m-0"}}>
        {path.map((folder, index) => (
            <Breadcrumb.Item linkAs={Link} 
                linkProps={{
                    to: {
                        pathname: folder.id ? `/drive/folder/${folder.id}` : `/drive`, 
                        state: {folder: {...folder, path: path.slice(1, index)}}
                    },
                    style: {textDecoration: "none"}
                }}
                key={folder.id} className="text-truncate d-inline-block" style={{maxWidth: 200}}>
                {folder.name}
            </Breadcrumb.Item>  
        ))}
        {currentFolder && (
            <Breadcrumb.Item className="text-truncate d-inline-block" style={{maxWidth: 200}} active>
                {currentFolder.name}
            </Breadcrumb.Item>  
        )}
    </Breadcrumb>
}
