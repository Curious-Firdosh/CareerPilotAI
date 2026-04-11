//! in the interview i am not going to use Tanstack Query .. i Will do it with context api


import { toast } from "sonner"
import { InterviewApi } from "../Services/interview.api"

import { useContext} from "react"
import { InterviewContext } from "../Interview.context"



export const useInterview = () => {

    const context = useContext(InterviewContext)

    

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context


    const GenerateReport = async ({ jobDescription, selfDescription, resume }) => {

        setLoading(true)
        let data = null;
        try {
            data = await InterviewApi.generateReport({ jobDescription, selfDescription, resume })
            setReport(data.interviewReport)
            
            toast.success(data.message || "Interview report generated successfully")
        }
        catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to generate interview report")
        }
        finally {
            setLoading(false)
        }

        return data?.interviewReport
    }

    const GetReportById = async (id) => {
        setLoading(true)
        let data = null;
        try {
            data = await InterviewApi.getInterviewReportById(id)
            setReport(data.InterviewReport)
        }
        catch (err) {
            toast.error("Failed to fetch interview report")
        }
        finally {
            setLoading(false)
        }
        return data?.interviewReport
    }

    const GetReports = async () => {
        setLoading(true)
        let data = null;
        try {
            data = await InterviewApi.getAllReports()
            setReports(data.interviewReports)
        }
        catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to fetch interview reports")
        }
        finally {
            setLoading(false)
        }
        return data?.interviewReports
    }


    const GenerateReportPdf = async (id) => {
        setLoading(true) 
        let data = null;

        try {
            data = await InterviewApi.generateReportPdf(id)
            const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `Resume-${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Failed to generate PDF")
        }
        finally {
            setLoading(false)
        }
    }

    return { GenerateReport, GetReportById, GetReports, GenerateReportPdf, loading, report, reports }
}


