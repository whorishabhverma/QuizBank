import React, { useState } from "react";  
import UserQuizContext from "./UserQuizContext";

const UserQuizContextProvider = ({children}) => {
    const [userQuiz, setuserQuiz] = useState(null);
    return <UserQuizContext.Provider value={{userQuiz,setuserQuiz}}>{children}</UserQuizContext.Provider>
}

export default UserQuizContextProvider;