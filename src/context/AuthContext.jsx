import React, { createContext, useEffect,  useState } from 'react';
import {onAuthStateChanged} from "firebase/auth"
import { auth, bdd } from '../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';

export const currentUser = createContext(null)


const AuthContext = ({children}) => {
    const [user,setUser] = useState(null)
    const [userInfo,setUserInfo] = useState(null)
    
    useEffect(()=>{
        const getUser = async () =>{
            onAuthStateChanged(auth,async(current)=>{
                setUser(current)
                onSnapshot(doc(bdd,"users",current?.uid),(data)=>{
                    setUserInfo(data.data())
                })       
            })
        }
        getUser()
    },[])
    return (
        <currentUser.Provider value={{user,userInfo}}>
            {children}
        </currentUser.Provider>
    );
};

export default AuthContext;