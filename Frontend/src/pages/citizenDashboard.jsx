import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./SectorHead/LoadingSpinner";
import IssueCard from "./IssueCard";
import IssueDetailsModal from "./CitizenDashboard/IssueDetailsModal";
import NewIssueModal from "./CitizenDashboard/NewIssueModal";
import FeedbackModal from "./FeedbackModal";

const backend_URL = import.meta.env.VITE_BACKEND_URL;

function CitizenRequests({ requests, setRequests, onCreateRequest, isMobile }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${backend_URL}/api/request/my-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [setRequests]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      <style>{`
        .citizen-requests {
          padding: ${isMobile ? '12px' : '16px'};
        }

        .citizen-requests h2 {
          font-size: ${isMobile ? '18px' : '20px'};
          font-weight: bold;
          margin-bottom: 12px;
        }

        .empty-msg {
          color: gray;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }

        .request-card {
          border: 1px solid #ddd;
          border-radius: 15px;
          padding: ${isMobile ? '12px' : '16px'};
          margin-bottom: 12px;
          box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1);
          background: #112240;
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-direction: ${isMobile ? 'column' : 'row'};
          gap: ${isMobile ? '8px' : '0'};
        }

        .request-header h3 {
          margin: 0;
          font-weight: bold;
          font-size: ${isMobile ? '14px' : '16px'};
          flex: 1;
        }

        .status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: ${isMobile ? '12px' : '13px'};
          font-weight: bold;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .status-approved {
          background: #00ff3cff;
          color: #155724;
        }

        .status-rejected {
          background: #ff0015ff;
          color: #721c24;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .remarks {
          margin-top: 8px;
          color: #555;
          font-style: italic;
          font-size: ${isMobile ? '12px' : '14px'};
        }

        .loading {
          text-align: center;
          color: gray;
          padding: 20px;
        }

        .create-request-btn {
          margin-bottom: 20px;
          padding: ${isMobile ? '8px 16px' : '10px 20px'};
          background-color: #64ffda;
          color: #0a192f;
          border: none;
          border-radius: 30px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          width: ${isMobile ? '100%' : 'auto'};
          font-size: ${isMobile ? '14px' : '16px'};
        }

        .create-request-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(100, 255, 218, 0.3);
        }

        .request-card p {
          margin: 4px 0;
          font-size: ${isMobile ? '12px' : '14px'};
        }
      `}</style>

      <div className="citizen-requests">
        <button 
          className="create-request-btn"
          onClick={onCreateRequest}
        >
          <i className="fas fa-plus"></i> Create New Request
        </button>
        
        {requests.length === 0 ? (
          <p className="empty-msg">No requests submitted yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="request-card">
              <div className="request-header">
                <h3>{req.gatheringName}</h3>
                <span
                  className={`status ${
                    req.status === "approved"
                      ? "status-approved"
                      : req.status === "rejected"
                      ? "status-rejected"
                      : "status-pending"
                  }`}
                >
                  {req.status}
                </span>
              </div>
              <p>📍 {req.location}</p>
              <p>👥 {req.expectedPeople} people</p>
              <p>📅 {new Date(req.date).toLocaleDateString()}</p>
              <p>🎯 {req.type}</p>
              {req.remarks && <p className="remarks">Remarks: {req.remarks}</p>}
            </div>
          ))
        )}
      </div>
    </>
  );
}

function NewRequestModal({ onSubmit, onClose, isMobile }) {
  const [formData, setFormData] = useState({
    gatheringName: "",
    type: "Cultural",
    expectedPeople: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.gatheringName.trim()) {
      newErrors.gatheringName = "Gathering name is required";
    }
    
    if (!formData.expectedPeople || formData.expectedPeople <= 0) {
      newErrors.expectedPeople = "Please enter a valid number of people";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: isMobile ? '10px' : '20px',
      backdropFilter: 'blur(7px)'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: isMobile ? '20px' : '30px',
        borderRadius: isMobile ? '20px' : '60px',
        width: '100%',
        maxWidth: isMobile ? '95%' : '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        border: '1px solid #233554'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #233554'
        }}>
          <h2 style={{
            color: '#64ffda',
            margin: 0,
            fontSize: isMobile ? '1.2rem' : '1.5rem'
          }}>
            Create New Gathering Request
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ccd6f6',
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500',
              fontSize: isMobile ? '14px' : '16px'
            }}>
              Gathering Name *
            </label>
            <input
              type="text"
              name="gatheringName"
              value={formData.gatheringName}
              onChange={handleChange}
              style={{
                width: isMobile ? '85%' : '90%',
                padding: isMobile ? '10px' : '12px',
                borderRadius: '30px',
                border: errors.gatheringName ? '2px solid #ff6b6b' : '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: isMobile ? '14px' : '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter gathering name"
            />
            {errors.gatheringName && (
              <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
                {errors.gatheringName}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500',
              fontSize: isMobile ? '14px' : '16px'
            }}>
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: isMobile ? '90%' : '95%',
                padding: isMobile ? '10px' : '12px',
                borderRadius: '40px',
                border: '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: isMobile ? '14px' : '1rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Cultural">Cultural</option>
              <option value="Religious">Religious</option>
              <option value="Political">Political</option>
              <option value="Family">Family</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500',
              fontSize: isMobile ? '14px' : '16px'
            }}>
              Expected Number of People *
            </label>
            <input
              type="number"
              name="expectedPeople"
              value={formData.expectedPeople}
              onChange={handleChange}
              min="1"
              style={{
                width: isMobile ? '85%' : '91%',
                padding: isMobile ? '10px' : '12px',
                borderRadius: '40px',
                border: errors.expectedPeople ? '2px solid #ff6b6b' : '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: isMobile ? '14px' : '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter number of people"
            />
            {errors.expectedPeople && (
              <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
                {errors.expectedPeople}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500',
              fontSize: isMobile ? '14px' : '16px'
            }}>
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{
                width: isMobile ? '85%' : '91%',
                padding: isMobile ? '10px' : '12px',
                borderRadius: '40px',
                border: errors.date ? '2px solid #ff6b6b' : '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: isMobile ? '14px' : '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            {errors.date && (
              <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
                {errors.date}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500',
              fontSize: isMobile ? '14px' : '16px'
            }}>
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{
                width: isMobile ? '85%' : '91%',
                padding: isMobile ? '10px' : '12px',
                borderRadius: '40px',
                border: errors.location ? '2px solid #ff6b6b' : '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: isMobile ? '14px' : '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter location details"
            />
            {errors.location && (
              <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
                {errors.location}
              </p>
            )}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            marginTop: '30px',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: isMobile ? '12px' : '10px 20px',
                borderRadius: '40px',
                border: '1px solid #233554',
                background: 'transparent',
                color: '#ccd6f6',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontSize: isMobile ? '14px' : '16px',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: isMobile ? '12px' : '10px 20px',
                borderRadius: '40px',
                border: 'none',
                background: '#64ffda',
                color: '#0a192f',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1,
                fontSize: isMobile ? '14px' : '16px',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating...
                </>
              ) : (
                'Create Request'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
      `}</style>
    </div>
  );
}

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [citizenName, setCitizenName] = useState("");
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [issueToFeedback, setIssueToFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [showRequests, setShowRequests] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigate = useNavigate();

  // Responsive breakpoints
  const isMobile = windowSize.width <= 768;
  const isTablet = windowSize.width > 768 && windowSize.width <= 1024;

  const statusFilters = [
    { id: "all", label: "All Issues" },
    { id: "pending", label: "Pending" },
    { id: "in-progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" },
    { id: "escalated", label: "Escalated" },
    { id: "closed", label: "Closed" }
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchFeedbacks = async (token, issuesData) => {
    const closedIssues = issuesData.filter(issue => issue.status === "closed");
    if (closedIssues.length > 0) {
      try {
        const response = await axios.get(
          `${backend_URL}/api/feedback/batch`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              issueIds: closedIssues.map(issue => issue._id).join(',')
            }
          }
        );
        
        if (response.data && response.data.feedbacks) {
          const feedbacksMap = {};
          response.data.feedbacks.forEach(feedback => {
            if (feedback) {
              feedbacksMap[feedback.issueId] = feedback;
            }
          });
          return feedbacksMap;
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    }
    return {};
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const [citizenRes, issuesRes] = await Promise.all([
        axios.get(`${backend_URL}/api/citizen/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backend_URL}/api/issues/my`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setCitizenName(citizenRes.data.name || "Citizen");
      const issuesData = Array.isArray(issuesRes.data)
        ? issuesRes.data
        : issuesRes.data?.issues || [];
      
      const feedbacksData = await fetchFeedbacks(token, issuesData);
      
      setIssues(issuesData);
      setFilteredIssues(issuesData);
      setFeedbacks(feedbacksData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredIssues(issues);
    } else {
      const normalize = (str) => str?.toLowerCase().replace(/[\s_]+/g, "-");
      setFilteredIssues(
        issues.filter(
          (issue) => normalize(issue.status) === normalize(activeFilter)
        )
      );
    }
  }, [activeFilter, issues]);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleCreateNewIssue = async (newIssueData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backend_URL}/api/issues/report`,
        newIssueData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIssues([response.data, ...issues]);
      setFilteredIssues([response.data, ...filteredIssues]);
      setShowNewIssueModal(false);
    } catch (error) {
      console.error("Error creating new issue:", error);
    }
  };

  const handleCreateNewRequest = async (requestData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backend_URL}/api/request/create`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh the requests list
      const token2 = localStorage.getItem("token");
      const requestsRes = await axios.get(`${backend_URL}/api/request/my-requests`, {
        headers: { Authorization: `Bearer ${token2}` }
      });
      
      setRequests(requestsRes.data);
      
      return response.data;
    } catch (error) {
      console.error("Error creating new request:", error);
      throw error;
    }
  };

  const handleExportIssues = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backend_URL}/api/issues/export-issues`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "my-issues-export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting issues:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeModal = () => {
    setSelectedIssue(null);
  };

  const handleFeedbackClick = (issue) => {
    setIssueToFeedback(issue);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (issueId, rating, comment) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${backend_URL}/api/feedback/submit`,
        { issueId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIssues((prev) =>
        prev.map((issue) => {
          if (!issue || !issue._id) return issue;
          return issue._id === issueId ? { ...issue, hasFeedback: true } : issue;
        })
      );
    } catch (err) {
      console.error("Error submitting feedback:", err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a192f",
        fontFamily: "'Poppins', sans-serif",
        color: "#ccd6f6",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      <header
        style={{
          backgroundColor: "#112240",
          padding: isMobile ? "15px" : "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "15px" : "0"
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "15px",
          justifyContent: isMobile ? "center" : "flex-start",
          width: isMobile ? "100%" : "auto"
        }}>
          <h1
            style={{
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              fontWeight: "600",
              margin: 0,
              color: "#64ffda",
              textAlign: isMobile ? "center" : "left"
            }}
          >
            <i className="fas fa-user" style={{ marginRight: "10px" }}></i>
            {citizenName}'s Dashboard
          </h1>
        </div>

        <div style={{ 
          display: "flex", 
          gap: "10px", 
          flexWrap: "wrap",
          justifyContent: isMobile ? "center" : "flex-end",
          width: isMobile ? "100%" : "auto"
        }}>
          <button
            onClick={() => setShowRequests(true)}
            style={{
              padding: isMobile ? "6px 12px" : "8px 15px",
              borderRadius: "100px",
              border: "none",
              background: "#64ffda",
              color: "#0a192f",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flex: isMobile ? "1" : "none",
              minWidth: isMobile ? "120px" : "auto",
              justifyContent: "center"
            }}
          >
            <i className="fas fa-calendar-check"></i> 
            {isMobile ? "Requests" : "My Requests"}
          </button>

          <button
            onClick={() => setShowNewIssueModal(true)}
            style={{
              padding: isMobile ? "6px 12px" : "8px 15px",
              borderRadius: "100px",
              border: "none",
              background: "#64ffda",
              color: "#0a192f",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flex: isMobile ? "1" : "none",
              minWidth: isMobile ? "120px" : "auto",
              justifyContent: "center"
            }}
          >
            <i className="fas fa-plus"></i> 
            {isMobile ? "New Issue" : "New Issue"}
          </button>

          <button
            onClick={handleExportIssues}
            disabled={exporting}
            style={{
              padding: isMobile ? "6px 12px" : "8px 15px",
              borderRadius: "100px",
              border: "none",
              background: "#1e90ff",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flex: isMobile ? "1" : "none",
              minWidth: isMobile ? "120px" : "auto",
              justifyContent: "center",
              opacity: exporting ? 0.7 : 1
            }}
          >
            {exporting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> 
                {isMobile ? "..." : "Exporting..."}
              </>
            ) : (
              <>
                <i className="fas fa-download"></i> 
                {isMobile ? "Export" : "Export Issues"}
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: isMobile ? "6px 12px" : "8px 15px",
              borderRadius: "100px",
              border: "none",
              background: "#ff6b6b",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flex: isMobile ? "1" : "none",
              minWidth: isMobile ? "120px" : "auto",
              justifyContent: "center"
            }}
          >
            <i className="fas fa-sign-out-alt"></i> 
            {isMobile ? "Logout" : "Logout"}
          </button>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          width: "100%",
          overflowY: "auto",
          padding: isMobile ? "15px" : "20px",
          boxSizing: "border-box"
        }}
      >
        {!showRequests ? (
          <div
            style={{
              width: "100%",
              maxWidth: "100%",
              padding: isMobile ? "0 10px" : "0 20px",
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "15px",
                flexDirection: isMobile ? "column" : "row"
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? "1.3rem" : "1.5rem",
                  fontWeight: "600",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#ccd6f6"
                }}
              >
                <i className="fas fa-exclamation-circle"></i> Your Reported Issues
              </h2>

              <div style={{ 
                display: "flex", 
                gap: "8px", 
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : "flex-end",
                width: isMobile ? "100%" : "auto"
              }}>
                {statusFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    style={{
                      padding: isMobile ? "6px 12px" : "8px 15px",
                      borderRadius: "20px",
                      border: "none",
                      background:
                        activeFilter === filter.id ? "#64ffda" : "#112240",
                      color:
                        activeFilter === filter.id ? "#0a192f" : "#ccd6f6",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: isMobile ? "0.7rem" : "0.8rem",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      flex: isMobile ? "1" : "none",
                      minWidth: isMobile ? "80px" : "auto",
                      justifyContent: "center"
                    }}
                  >
                    {isMobile ? filter.label.split(' ')[0] : filter.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredIssues.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#8892b0",
                  backgroundColor: "#112240",
                  borderRadius: "8px",
                  marginTop: "20px"
                }}
              >
                <i
                  className="fas fa-check-circle"
                  style={{
                    fontSize: isMobile ? "2rem" : "3rem",
                    color: "#64ffda",
                    marginBottom: "15px"
                  }}
                ></i>
                <p style={{ fontSize: isMobile ? "1rem" : "1.1rem" }}>
                  {activeFilter === "all"
                    ? "You haven't reported any issues yet."
                    : `No ${
                        statusFilters.find((f) => f.id === activeFilter)?.label
                      } issues found.`}
                </p>
                <button
                  onClick={() => setShowNewIssueModal(true)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    background: "#64ffda",
                    color: "#0a192f",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    transition: "all 0.3s ease",
                    marginTop: "15px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <i className="fas fa-plus"></i> Report Your First Issue
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(auto-fill, minmax(280px, 1fr))" : "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: isMobile ? "15px" : "20px",
                  width: "100%"
                }}
              >
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue._id}
                    issue={issue}
                    isSelected={selectedIssue?._id === issue._id}
                    onClick={() => handleIssueClick(issue)}
                    onFeedbackClick={
                      issue.status?.toLowerCase() === "closed" && !feedbacks[issue._id]
                        ? () => handleFeedbackClick(issue)
                        : null
                    }
                    feedback={feedbacks[issue._id]}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '15px' : '0'
            }}>
              <h2 style={{
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                fontWeight: '600',
                margin: 0,
                color: '#ccd6f6',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                My Gathering Requests
              </h2>
              <button
                onClick={() => setShowRequests(false)}
                style={{
                  padding: isMobile ? '8px 16px' : '8px 16px',
                  backgroundColor: '#64ffda',
                  color: '#0a192f',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: isMobile ? '14px' : '16px',
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Issues
              </button>
            </div>
            <CitizenRequests 
              requests={requests}
              setRequests={setRequests}
              onCreateRequest={() => setShowNewRequestModal(true)}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>

      {showNewIssueModal && (
        <NewIssueModal
          onSubmit={handleCreateNewIssue}
          onClose={() => setShowNewIssueModal(false)}
          isMobile={isMobile}
        />
      )}

      {showNewRequestModal && (
        <NewRequestModal
          onSubmit={handleCreateNewRequest}
          onClose={() => setShowNewRequestModal(false)}
          isMobile={isMobile}
        />
      )}

      {selectedIssue && (
        <IssueDetailsModal
          selectedIssue={selectedIssue}
          onClose={closeModal}
          isCitizenView={true}
          feedback={feedbacks[selectedIssue._id]}
          isMobile={isMobile}
        />
      )}

      {showFeedbackModal && issueToFeedback && (
        <FeedbackModal
          issue={issueToFeedback}
          existingFeedback={feedbacks[issueToFeedback._id]}
          onSubmit={(rating, comment) => 
            handleFeedbackSubmit(issueToFeedback._id, rating, comment)
          }
          onClose={() => {
            setShowFeedbackModal(false);
            setIssueToFeedback(null);
          }}
          isMobile={isMobile}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
       
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
       
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .issue-card {
          transition: all 0.3s ease;
        }

        .issue-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 8px rgba(255, 255, 255, 0.15);
        }

        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .header-buttons {
            width: 100%;
            justify-content: center;
          }
          
          .filter-buttons {
            width: 100%;
            justify-content: center;
          }
          
          .modal-content {
            width: 95% !important;
            margin: 10px !important;
            padding: 15px !important;
          }
        }

        /* Tablet-specific styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
