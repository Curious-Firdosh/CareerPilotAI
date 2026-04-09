import React from 'react'
import '../styles/generatedReports.scss'
import { useInterview } from '../Hooks/useInterview';
import { useNavigate } from 'react-router-dom';

const AllGeneratedReports = () => {

  const {reports} = useInterview();
  const navigate = useNavigate()
    
  const getMatchBadgeClass = (score) => {
    if (score >= 80) return 'match-excellent';
    if (score >= 70) return 'match-good';
    if (score >= 50) return 'match-fair';
    return 'match-low';
  };

  const getMatchText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Low';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="generated-reports-section">
      {/* Header */}
      <div className="reports-container">
        <div className="reports-header">
          <div>
            <h2>Previous Reports</h2>
            <p className="reports-subtitle">Your Interview Preparation History</p>
          </div>
          <div className="reports-count">
            <span className="count-badge">{reports.length}</span>
            <span className="count-label">Reports Generated</span>
          </div>
        </div>

        {/* Reports Grid */}
        {reports.length > 0 ? (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="report-card">
                {/* Card Header */}
                <div className="report-card__header">
                  <div className="report-card__title-section">
                    <h3 className="report-card__title">{report.title}</h3>
                    <span className={`match-badge ${getMatchBadgeClass(report.matchScore)}`}>
                      {report.matchScore}% - {getMatchText(report.matchScore)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="report-card__body">
                  <div className="report-info">
                    <span className="info-label">Match Score</span>
                    <div className="score-circle">
                      {report.matchScore}%
                    </div>
                  </div>

                  <div className="report-info">
                    <span className="info-label">Generated</span>
                    <span className="info-value">{formatDate(report.createdAt)}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="report-card__footer">
                  <button 
                    className="view-report-btn"
                    onClick={() => navigate(`/interview/report/${report._id}`)}
                >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h3>No Reports Yet</h3>
            <p>Generate your first interview preparation report above!</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default AllGeneratedReports
