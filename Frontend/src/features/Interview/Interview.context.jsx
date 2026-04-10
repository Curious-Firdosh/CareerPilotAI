import { createContext, useState } from "react";

//eslint-disable-next-line
export const InterviewContext = createContext()


export const InterviewProvider = ({children}) => {

    const [loading , setLoading] = useState(false)
    const [report , setReport] = useState(null)
    const [reports , setReports] = useState([])
    const [user , setuser] = useState(null)

    return (
        <InterviewContext.Provider value={{loading , setLoading , report , setReport , reports , setReports ,user , setuser}}>
            {children}
        </InterviewContext.Provider>
    )
}