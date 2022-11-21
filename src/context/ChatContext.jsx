import React, { useReducer } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { currentUser } from "./AuthContext";

export const chatContext = createContext(null);

const ChatContext = ({ children }) => {
  const { userInfo } = useContext(currentUser);
  const initialState = {
    chatId: "",
    user: {},
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "SELECT_USER":
        return {
          chatId:
            userInfo.uid > action.payload.uid
              ? userInfo.uid + action.payload.uid
              : action.payload.uid + userInfo.uid,
          user: action.payload,
        };
        break;

      default:
        return state;
        break;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <chatContext.Provider value={{ state, dispatch }}>
      {children}
    </chatContext.Provider>
  );
};

export default ChatContext;
