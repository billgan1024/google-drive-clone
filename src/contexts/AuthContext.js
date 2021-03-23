import React, {useContext, useState, useEffect} from "react";
import {auth} from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    //current user data
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logout() {
        return auth.signOut();
    }

    function resetPassword(email) {
        //sends a password reset email to the specified password
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email) {
        currentUser.updateEmail(email);
    }

    function updatePassword(password) {
        currentUser.updatePassword(password);
    }

    //change user event (only called once this component mounts)
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            //update user here locally
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    //export currentUser and the signup and login functions to be used elsewhere
    const value = { currentUser, signup, login, logout, resetPassword, updateEmail, updatePassword };

    return (
        //value holds all information that we want to provide to the auth server thing
        //only load stuff once the user is set
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
