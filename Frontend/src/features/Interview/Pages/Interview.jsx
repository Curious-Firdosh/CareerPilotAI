import React, { useEffect, useState } from 'react';
import '../styles/interview.scss';
import { useInterview } from '../Hooks/useInterview';
import LoadingSpinner from '../Components/Spinner';
import { useParams } from 'react-router-dom';
import { PdfLoader } from '../Components/PdfLoader';

// Sub-component for individual questions
const QuestionCard = ({ qId, question, intention, answer, isOpen, onToggle }) => {
  return (
    <div className="question-card">
      <button className="q-header" onClick={onToggle} aria-expanded={isOpen}>
        <span className="q-badge">{qId}</span>
        <span className="q-text">{question}</span>
        <span className={`chevron ${isOpen ? 'active' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="q-body">
          <div className="content-column">
            <div className="ans-block">
              <span className="label-tag intention">Intention</span>
              <p>{intention}</p>
            </div>
            <div className="ans-block">
              <span className="label-tag model">Model Answer</span>
              <p>{answer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for the Active Navigation Header
const ActiveNav = ({ activeTab, questionCount }) => {
  return (
    <div className="content-header">
      <h1 className="heading">{activeTab}</h1>
      <span className="badge">
        {activeTab === 'Road Map'
          ? '7-day plan'
          : `${questionCount} questions`}
      </span>
    </div>
  );
};

const Interview = () => {
  const [activeTab, setActiveTab] = useState('Technical Questions');
  const [expandedId, setExpandedId] = useState(null);
  const { id } = useParams()
  const { report, GetReportById, GenerateReportPdf } = useInterview();
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    if (id) {
      GetReportById(id);
    }
  }, [id]);

  const handleGeneratePdf = async (id) => {
    setLoadingPdf(true);
    await GenerateReportPdf(id);
    setLoadingPdf(false);
  }

  if (loadingPdf) {
    return <main><PdfLoader /></main>
  }

  if (!report) {
    return <main><LoadingSpinner isLoading={true} /></main>;
  }

  const getMatchStatus = (score) => {
    if (score >= 90) return { text: "HIRABLE. Actually smashing it.", class: "exceptional" };
    if (score >= 80) return { text: "STRONG HIRE. Solid work.", class: "strong" };
    if (score >= 70) return { text: "AVERAGE. Needs improvement.", class: "good" };
    if (score >= 60) return { text: "WEAK. Fix your basics.", class: "moderate" };
    if (score >= 50) return { text: "JUNIOR LEVEL.", class: "emerging" };
    return { text: "NOT HIRABLE.", class: "low" };
  };

  const status = getMatchStatus(report.matchScore || 0);

  const currentQuestions =
    activeTab === 'Technical Questions'
      ? report.technicalQuestions || []
      : report.behavioralQuestions || [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedId(null);
  };

  return (
    <div className="interview-page">

      {/* Sidebar */}
      <aside className="sidebar-left">
        <span className="section-label">{report.title}</span>
        <nav className="nav-group">
          {['Technical Questions', 'Behavioral Questions', 'Road Map'].map((tab) => (
            <button
              key={tab}
              className={`nav-item ${activeTab === tab ? 'active' : 'normal'}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button className='generate-pdf-btn'
          disabled={loadingPdf}
          onClick={() => handleGeneratePdf(report._id)}>
          Generate PDF
        </button>
      </aside>


      <div>
        {/* Main */}
        <main className="main-content">

      

          {/* Roadmap */}
          {activeTab === 'Road Map' ? (
            <div className="road-map-container">
              {report.preparationPlan?.map((step) => (
                <div key={step.day} className="road-step">
                  <div className="dot"></div>
                  <div className="step-card">
                    <h3>Day {step.day}: {step.focus}</h3>
                    <ul>
                      {step.tasks?.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="question-list">
              {currentQuestions.map((q, idx) => (
                <QuestionCard
                  key={idx}
                  qId={`Q${idx + 1}`}
                  question={q.question}
                  intention={q.intention}
                  answer={q.answer}
                  isOpen={expandedId === idx}
                  onToggle={() =>
                    setExpandedId(expandedId === idx ? null : idx)
                  }
                />
              ))}
            </div>
          )}
        </main>


      </div>

      {/* Right Sidebar */}
      <aside className="sidebar-right">
        <div className="widget">
          <span className="section-label">Candidate Match</span>
          <div className={`match-score-widget ${status.class}`}>
            <div className="circle">{report.matchScore}%</div>
            <div className="status">{status.text}</div>
          </div>
        </div>

        <div className="widget">
          <span className="section-label">Critical Gaps</span>
          <div className="gap-list">
            {report.skillGaps?.map((gap, i) => (
              <div key={i} className={`gap-card ${gap.severity}`}>
                {gap.skill}
              </div>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
};

export default Interview;