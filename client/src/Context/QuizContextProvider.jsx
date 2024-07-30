import React, { useState } from "react";
import QuizContext from "./QuizContext";
const QuizContextProvider = ({ children }) => {
  const [form, setForm] = useState(null);
  
  return <QuizContext.Provider value={{form, setForm}}>{children}</QuizContext.Provider>;
};

export default QuizContextProvider;
