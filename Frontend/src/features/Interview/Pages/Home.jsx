import React, { useEffect, useRef, useState } from "react";
import "../styles/home.scss";
import { useInterview } from "../Hooks/useInterview";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import Loader from "../Components/Loader";
import LandingHeader from "../Components/LandingHeader";
import AllGeneratedReports from "../Components/allGeneratedReports";
import { useParams } from "react-router"
import LoadingSpinner from "../Components/Spinner";

const Home = () => {
  const { loading, GenerateReport, GetReports, GetReportById } = useInterview();


  const { id } = useParams();

  const navigate = useNavigate();

 //@ LOCAL STATE for the button click specifically
  const [isGenerating, setIsGenerating] = useState(false);

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const resumeInputRef = useRef();


  useEffect(() => {
    if (id) {
      GetReportById(id);
    }
    else {
      GetReports();
    }
  }, [id]);




  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleGenerateReport = async () => {
    // Validation
    if (!jobDescription.trim()) {
      return toast.error("Please paste a Job Description first.");
    }

    if (!resumeFile && !selfDescription.trim()) {
      return toast.error(
        "Please upload a Resume OR provide a Self-Description."
      );
    }


    try {
      setIsGenerating(true); // START LOADER ONLY HERE
      const report = await GenerateReport({
        jobDescription,
        selfDescription,
        resume: resumeFile,
      });

      navigate(`/interview/report/${report._id}`);

    } catch (error) {
      console.log(error);
      setIsGenerating(false); // STOP LOADER ON ERROR

      // Extract backend message safely
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      // Detect AI-specific failure
      if (
        message.toLowerCase().includes("ai") ||
        message.toLowerCase().includes("model") ||
        message.toLowerCase().includes("openai")
      ) {
        toast.error("AI is currently overloaded or facing issues. Try again later.");
      } else if (message.toLowerCase().includes("network")) {
        toast.error("Network issue. Check your internet.");
      } else {
        toast.error(message);
      }
    }
  };

  if (loading && !isGenerating) {
    return <LoadingSpinner/>;
  }

  if (isGenerating) {
    return (
      <div className="loader-container">
        <Loader isComplete={false} />
        <p className="loader-text">
          Generating your personalized interview plan...
        </p>
      </div>
    );
  }



  return (
    <div>
      <LandingHeader />

      <main className="home-page">
        {/* PAGE HEADER */}
        <div className="page-header">
          <h1>
            Create Your Custom <span className="highlight">Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="interview-card">
          {/* CARD BODY */}
          <div className="interview-card__body">
            {/* LEFT PANEL - JOB DESCRIPTION */}
            <div className="panel panel--left">
              <div className="panel__header">
                <h2>Target Job Description</h2>
              </div>

              <textarea
                className="panel__textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here...
e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                maxLength={5000}
              />

              <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#7d8590" }}>
                {jobDescription.length} / 5000 chars
              </div>
            </div>

            {/* RIGHT PANEL - USER PROFILE */}
            <div className="panel panel--right">
              {/* UPLOAD RESUME SECTION */}
              <div>
                <div className="panel__header">
                  <h2>Upload Resume</h2>
                </div>

                <label className="dropzone">
                  <input
                    type="file"
                    hidden
                    ref={resumeInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <div className="dropzone__icon">☁️</div>
                  <p className="dropzone__title">
                    {resumeFile
                      ? resumeFile.name
                      : "Click to upload or drag & drop"}
                  </p>
                  <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                </label>
              </div>

              {/* OR DIVIDER */}
              <div className="or-divider">
                <span>OR</span>
              </div>

              {/* QUICK SELF-DESCRIPTION SECTION */}
              <div>
                <div className="panel__header">
                  <h2>Quick Self-Description</h2>
                </div>

                <textarea
                  className="panel__textarea"
                  placeholder="Briefly describe your experience, key skills, and years of experience. If you don't have a resume handy..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  maxLength={2000}
                />
              </div>

              {/* INFO BOX */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(30, 144, 255, 0.1)",
                  border: "1px solid rgba(30, 144, 255, 0.3)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  color: "#7d8590",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#1e90ff", marginTop: "2px" }}>●</span>
                <p style={{ margin: 0 }}>
                  Either a <strong style={{ color: "#e6edf3" }}>Resume</strong> or{" "}
                  <strong style={{ color: "#e6edf3" }}>Self Description</strong> is
                  required to generate a personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* CARD FOOTER */}
          <div className="interview-card__footer">
            <span style={{ fontSize: "0.85rem", color: "#7d8590" }}>
              AI-Powered Strategy Generation • Approx 30s
            </span>
            <button
              onClick={handleGenerateReport}
              className="generate-btn"
              type="button"
            >
              ✨ Generate My Interview Strategy
            </button>
          </div>
        </div>
      </main>

      <AllGeneratedReports />

      <div style={{ height: "5rem" }}></div>


    </div>
  );
};



export default Home;