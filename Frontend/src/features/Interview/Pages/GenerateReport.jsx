import React, { useEffect, useRef, useState } from "react";
import "../styles/home.scss"; // Assuming this is where the new SCSS goes
import { useInterview } from "../Hooks/useInterview";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import Loader from "../Components/Loader";
import AllGeneratedReports from "../Components/AllGeneratedReports";
import LoadingSpinner from "../Components/Spinner";

// Added Icons for a premium feel
import { Briefcase, FileText, UploadCloud, Edit3, Sparkles, Info } from 'lucide-react';

const GenerateReport = () => {
  const { loading, GenerateReport, GetReports, GetReportById } = useInterview();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const resumeInputRef = useRef();

  useEffect(() => {
    if (id) {
      GetReportById(id);
    } else {
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
    if (!jobDescription.trim()) {
      return toast.error("Please paste a Job Description first.");
    }

    if (!resumeFile && !selfDescription.trim()) {
      return toast.error("Please upload a Resume OR provide a Self-Description.");
    }

    try {
      setIsGenerating(true);
      const report = await GenerateReport({
        jobDescription,
        selfDescription,
        resume: resumeFile,
      });

      navigate(`/interview/report/${report._id}`);
    } catch (error) {
      console.log(error);
      setIsGenerating(false);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

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
    return <LoadingSpinner />;
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
    <div className="premium-generator-wrapper">
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

        {/* MAIN LAYOUT */}
        <div className="interview-card">
          <div className="interview-card__body">
            
            {/* LEFT PANEL - JOB DESCRIPTION */}
            <div className="panel panel--left">
              <div className="panel__header">
                <Briefcase size={20} className="panel-icon" />
                <h2>Target Job Description</h2>
              </div>
              <p className="panel__hint">Paste the full job posting here. We'll extract the core requirements.</p>

              <textarea
                className="panel__textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                maxLength={5000}
              />

              <div className="char-counter">
                {jobDescription.length} / 5000 chars
              </div>
            </div>

            {/* RIGHT PANEL - USER PROFILE */}
            <div className="panel panel--right">
              
              {/* UPLOAD RESUME SECTION */}
              <div className="upload-section">
                <div className="panel__header">
                  <FileText size={20} className="panel-icon" />
                  <h2>Your Profile Context</h2>
                </div>

                <label className="dropzone">
                  <input
                    type="file"
                    hidden
                    ref={resumeInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <div className="dropzone__icon"><UploadCloud size={32} /></div>
                  <p className="dropzone__title">
                    {resumeFile ? resumeFile.name : "Click to upload your resume"}
                  </p>
                  <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                </label>
              </div>

              <div className="or-divider">
                <span>OR</span>
              </div>

              {/* QUICK SELF-DESCRIPTION SECTION */}
              <div className="description-section">
                <div className="panel__header">
                  <Edit3 size={18} className="panel-icon" />
                  <h2>Quick Self-Description</h2>
                </div>

                <textarea
                  className="panel__textarea panel__textarea--small"
                  placeholder="Briefly describe your current role, key skills, and years of experience..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  maxLength={2000}
                />
              </div>

              {/* INFO BOX */}
              <div className="info-box">
                <Info size={16} className="info-box__icon" />
                <p>
                  Provide a <strong>Resume</strong> OR a <strong>Self Description</strong> to generate a highly personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* CARD FOOTER CTA */}
          <div className="interview-card__footer">
            <span className="footer-timing">
              <Sparkles size={14} /> AI-Powered Analysis • Approx 30s
            </span>
            <button
              onClick={handleGenerateReport}
              className="generate-btn"
              type="button"
            >
              <Sparkles size={18} /> Generate Strategy
            </button>
          </div>
        </div>
      </main>

      <AllGeneratedReports />
    </div>
  );
};

export default GenerateReport;