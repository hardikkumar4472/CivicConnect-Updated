import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnalyticsModal from "./AnalyticsModal";
import LoadingSpinner from "./LoadingSpinner";
import IssueCard from "./IssueCard";
import DashboardSummaryModal from "./DashboardSummaryModal";
import IssueDetailsModal from "./IssueDetailsModal";
import CreateCitizen from "./CreateCitizen";

const backend_URL = import.meta.env.VITE_BACKEND_URL;

// Sector Requests Component
function SectorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backend_URL}/api/sector-head/gathering-request`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching sector requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${backend_URL}/api/sector-head/gathering/${id}/status`,
        { status, remarks: status === "approved" ? "Approved ✅" : "Rejected ❌" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="container">
      <h2 className="title">Sector Gathering Requests</h2>
      {requests.length === 0 ? (
        <p className="empty">No requests found for your sector.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="card">
            <div className="card-header">
              <h3 className="card-title">{req.gatheringName}</h3>
              <span
                className={`badge ${
                  req.status === "approved"
                    ? "success"
                    : req.status === "rejected"
                    ? "danger"
                    : "pending"
                }`}
              >
                {req.status}
              </span>
            </div>
            <p className="text">👤 {req.citizen?.name} ({req.citizen?.houseId})</p>
            <p className="text">📍 {req.location}</p>
            <p className="text">👥 {req.expectedPeople} people</p>
            <p className="text">📅 {new Date(req.date).toLocaleDateString()}</p>
            {req.remarks && <p className="remarks">Status: {req.remarks}</p>}

            {req.status === "pending" && (
              <div className="button-group">
                <button
                  onClick={() => handleAction(req._id, "approved")}
                  className="btn approve"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req._id, "rejected")}
                  className="btn reject"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <style>{`
        .container {
          padding: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .title {
          font-size: clamp(18px, 4vw, 24px);
          font-weight: bold;
          margin-bottom: 16px;
          color: #ccd6f6;
          text-align: center;
        }
        .empty {
          color: #8892b0;
          text-align: center;
          padding: 20px;
          font-size: clamp(14px, 3vw, 16px);
        }
        .card {
          background: #112240;
          padding: clamp(12px, 3vw, 16px);
          margin-bottom: 12px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          border: 1px solid #233554;
          width: 100%;
          box-sizing: border-box;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          flex-direction: column;
          gap: 8px;
        }
        @media (min-width: 480px) {
          .card-header {
            flex-direction: row;
            align-items: center;
          }
        }
        .card-title {
          font-weight: bold;
          color: #ccd6f6;
          font-size: clamp(14px, 3vw, 16px);
          margin: 0;
          word-break: break-word;
        }
        .text {
          font-size: clamp(12px, 2.5vw, 14px);
          margin: 4px 0;
          color: #8892b0;
          line-height: 1.4;
        }
        .remarks {
          font-size: clamp(12px, 2.5vw, 14px);
          margin-top: 6px;
          color: #a8b2d1;
          font-style: italic;
        }
        .badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: clamp(10px, 2.5vw, 12px);
          text-transform: capitalize;
          white-space: nowrap;
        }
        .badge.success {
          background: #d1fae5;
          color: #065f46;
        }
        .badge.danger {
          background: #fee2e2;
          color: #991b1b;
        }
        .badge.pending {
          background: #fef3c7;
          color: #92400e;
        }
        .button-group {
          margin-top: 10px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: white;
          font-size: clamp(12px, 2.5vw, 14px);
          flex: 1;
          min-width: 80px;
        }
        .btn.approve {
          background-color: #16a34a;
        }
        .btn.approve:hover {
          background-color: #15803d;
        }
        .btn.reject {
          background-color: #dc2626;
        }
        .btn.reject:hover {
          background-color: #b91c1c;
        }
        .loading {
          text-align: center;
          color: #8892b0;
          padding: 20px;
          font-size: clamp(14px, 3vw, 16px);
        }
      `}</style>
    </div>
  );
}

export default function SectorHeadDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectorName, setSectorName] = useState("");
  const [citizenDetails, setCitizenDetails] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "Loading..."
  });
  const [loadingCitizenDetails, setLoadingCitizenDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalIssues: 0,
    issuesByCategory: [],
    mostReportedCategory: 'N/A',
    avgResolutionTime: 'N/A',
    avgFeedbackRating: 'N/A'
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState({
    totalIssues: 0,
    openIssues: 0,
    closedIssues: 0,
    pendingIssues: 0,
    totalCitizens: 0
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCreateCitizen, setShowCreateCitizen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const navigate = useNavigate();

  // Status options for filtering
  const statusFilters = [
    { id: "all", label: "All Issues" },
    { id: "pending", label: "Pending" },
    { id: "in-progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" },
    { id: "escalated", label: "Escalated" },
    { id: "closed", label: "Closed" }
  ];

  // First load all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/sectorHead-login");
          return;
        }
        
        const [sectorRes, issuesRes, summaryRes] = await Promise.all([
          axios.get(`${backend_URL}/api/sector-head/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${backend_URL}/api/sector-head/issues`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${backend_URL}/api/sector-head/dashboard-summary`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setSectorName(sectorRes.data.sector || "Unknown Sector");
        const issuesData = Array.isArray(issuesRes.data) ? issuesRes.data : issuesRes.data?.issues || [];
        setIssues(issuesData);
        setFilteredIssues(issuesData);
        setDashboardSummary(summaryRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/sectorHead-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter issues based on active filter
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredIssues(issues);
    } else {
      const normalize = str => str?.toLowerCase().replace(/[\s_]+/g, "-"); 
      setFilteredIssues(
        issues.filter(
          issue => normalize(issue.status) === normalize(activeFilter)
        )
      );
    }
  }, [activeFilter, issues]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backend_URL}/api/sector-head/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchCitizenDetails = async (issue) => {
    if (!issue?.raisedBy) {
      console.warn('No raisedBy field in issue:', issue);
      return;
    }
    
    setLoadingCitizenDetails(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backend_URL}/api/sector-head/citizen/${issue.raisedBy}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCitizenDetails({
        name: response.data?.name || "Anonymous",
        email: response.data?.email || "Not provided",
        phone: response.data?.phone || "Not provided"
      });
    } catch (error) {
      console.error("Citizen details fetch failed:", error);
      setCitizenDetails({
        name: "Anonymous",
        email: "Not provided",
        phone: "Not provided"
      });
    } finally {
      setLoadingCitizenDetails(false);
    }
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    fetchCitizenDetails(issue);
  };

  const updateIssueStatus = async (issueId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${backend_URL}/api/issues/${issueId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIssues(issues.map(issue => 
        issue._id === issueId ? { ...issue, status } : issue
      ));
      
      if (selectedIssue && selectedIssue._id === issueId) {
        setSelectedIssue({ ...selectedIssue, status });
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  };

  const closeModal = () => {
    setSelectedIssue(null);
    setCitizenDetails({
      name: "Loading...",
      email: "Loading...",
      phone: "Loading..."
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a192f',
      fontFamily: "'Poppins', sans-serif",
      color: '#ccd6f6',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      width: '100vw',
      overflowX: 'hidden'
    }}>
      {/* Custom Navbar */}
      <div style={{
        backgroundColor: '#0a192f',
        padding: 'clamp(10px, 3vw, 15px) clamp(15px, 4vw, 20px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #233554',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(10px, 3vw, 20px)',
          flex: 1,
          minWidth: '200px'
        }}>
          <h2 style={{
            color: '#64ffda',
            margin: 0,
            fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textShadow: '0 0 10px rgba(100, 255, 218, 0.3)',
            transition: 'all 0.3s ease',
            wordBreak: 'break-word'
          }}>
            <i className="fas fa-map-marked-alt" style={{ transform: 'rotate(-15deg)' }}></i>
            {sectorName}
          </h2>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'block',
            background: 'transparent',
            border: 'none',
            color: '#64ffda',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '5px',
            transition: 'all 0.3s ease'
          }}
          className="mobile-menu-btn"
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        {/* Main Navigation */}
        <div style={{
          display: isMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'stretch',
          width: '100%',
          padding: '15px 0',
          borderTop: '1px solid #233554',
          marginTop: '10px'
        }}
        className="mobile-nav"
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px',
            width: '100%'
          }}>
            <button 
              onClick={() => setShowCreateCitizen(true)}
              style={{
                padding: '10px 12px',
                backgroundColor: '#64ffda',
                border: 'none',
                borderRadius: '30px',
                color: '#0a192f',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(100, 255, 218, 0.3)',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                minHeight: '44px'
              }}
            >
              <i className="fas fa-user-plus"></i>
              <span>Create Citizen</span>
            </button>

            <button 
              onClick={() => navigate('/send-broadcast')}
              style={{
                padding: '10px 12px',
                backgroundColor: '#112240',
                border: '1px solid #233554',
                borderRadius: '30px',
                color: '#ccd6f6',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                minHeight: '44px'
              }}
            >
              <i className="fas fa-bullhorn"></i>
              <span>Broadcast</span>
            </button>

            <button 
              onClick={() => setShowDashboard(true)}
              style={{
                padding: '10px 12px',
                backgroundColor: '#112240',
                border: '1px solid #233554',
                borderRadius: '30px',
                color: '#ccd6f6',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                minHeight: '44px'
              }}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => {
                setShowRequests(true);
                setIsMenuOpen(false);
              }}
              style={{
                padding: '10px 12px',
                backgroundColor: '#112240',
                border: '1px solid #233554',
                borderRadius: '30px',
                color: '#ccd6f6',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                minHeight: '44px'
              }}
            >
              <i className="fas fa-calendar-check"></i>
              <span>Gathering Requests</span>
            </button>

            <button 
              onClick={() => {
                fetchAnalytics();
                setShowAnalytics(true);
                setIsMenuOpen(false);
              }}
              disabled={loadingAnalytics}
              style={{
                padding: '10px 12px',
                backgroundColor: '#112240',
                border: '1px solid #233554',
                borderRadius: '30px',
                color: '#ccd6f6',
                fontWeight: 'bold',
                cursor: loadingAnalytics ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                minHeight: '44px',
                opacity: loadingAnalytics ? 0.7 : 1
              }}
            >
              {loadingAnalytics ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-chart-line"></i>
              )}
              <span>Analytics</span>
            </button>

            <button 
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              style={{
                padding: '10px 12px',
                backgroundColor: '#112240',
                border: '1px solid #233554',
                borderRadius: '30px',
                color: '#ccd6f6',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                minHeight: '44px'
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div style={{
          display: 'none',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
        className="desktop-nav"
        >
          <button 
            onClick={() => setShowCreateCitizen(true)}
            style={{
              padding: '10px 15px',
              backgroundColor: '#64ffda',
              border: 'none',
              borderRadius: '30px',
              color: '#0a192f',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 10px rgba(100, 255, 218, 0.3)',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className="fas fa-user-plus"></i>
            <span>Create Citizen</span>
          </button>

          <button 
            onClick={() => navigate('/send-broadcast')}
            style={{
              padding: '10px 15px',
              backgroundColor: '#112240',
              border: '1px solid #233554',
              borderRadius: '30px',
              color: '#ccd6f6',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className="fas fa-bullhorn"></i>
            <span>Broadcast</span>
          </button>

          <button 
            onClick={() => setShowDashboard(true)}
            style={{
              padding: '10px 15px',
              backgroundColor: '#112240',
              border: '1px solid #233554',
              borderRadius: '30px',
              color: '#ccd6f6',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => {
              setShowRequests(true);
            }}
            style={{
              padding: '10px 15px',
              backgroundColor: '#112240',
              border: '1px solid #233554',
              borderRadius: '30px',
              color: '#ccd6f6',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className="fas fa-calendar-check"></i>
            <span>Gathering Requests</span>
          </button>

          <button 
            onClick={() => {
              fetchAnalytics();
              setShowAnalytics(true);
            }}
            disabled={loadingAnalytics}
            style={{
              padding: '10px 15px',
              backgroundColor: '#112240',
              border: '1px solid #233554',
              borderRadius: '30px',
              color: '#ccd6f6',
              fontWeight: 'bold',
              cursor: loadingAnalytics ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              opacity: loadingAnalytics ? 0.7 : 1
            }}
          >
            {loadingAnalytics ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-chart-line"></i>
            )}
            <span>Analytics</span>
          </button>

          <button 
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            style={{
              padding: '10px 15px',
              backgroundColor: '#112240',
              border: '1px solid #233554',
              borderRadius: '30px',
              color: '#ccd6f6',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div style={{
        flex: 1,
        width: '100%',
        overflowY: 'auto',
        padding: 'clamp(15px, 3vw, 20px)',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #0a192f 0%, #0f2746 100%)'
      }}>
        {!showRequests ? (
          <div style={{
            width: '100%',
            maxWidth: '100%',
            padding: '0',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
                fontWeight: '600',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#ccd6f6',
                textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                width: '100%',
                justifyContent: 'center'
              }}>
                <i className="fas fa-exclamation-circle" style={{ 
                  color: '#64ffda'
                }}></i> 
                Reported Issues in Your Sector
              </h2>
              
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%'
              }}>
                {statusFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '20px',
                      border: 'none',
                      background: activeFilter === filter.id ? 
                        'linear-gradient(135deg, #64ffda 0%, #52dbb7 100%)' : 
                        'linear-gradient(135deg, #112240 0%, #1a2e4a 100%)',
                      color: activeFilter === filter.id ? '#0a192f' : '#ccd6f6',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: 'clamp(11px, 2.5vw, 13px)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: activeFilter === filter.id ? 
                        '0 4px 15px rgba(100, 255, 218, 0.4)' : 
                        '0 2px 5px rgba(0, 0, 0, 0.1)',
                      minHeight: '36px',
                      flex: '1 0 auto',
                      maxWidth: '140px',
                      justifyContent: 'center'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredIssues.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 'clamp(30px, 8vw, 40px) clamp(15px, 4vw, 20px)',
                color: '#8892b0',
                backgroundColor: 'rgba(17, 34, 64, 0.7)',
                borderRadius: '12px',
                marginTop: '20px',
                border: '1px dashed #233554',
                transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-check-circle" style={{
                  fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
                  color: '#64ffda',
                  marginBottom: '15px',
                  filter: 'drop-shadow(0 0 10px rgba(100, 255, 218, 0.3))'
                }}></i>
                <h3 style={{
                  fontSize: 'clamp(1.1rem, 4vw, 1.3rem)',
                  marginBottom: '10px',
                  color: '#ccd6f6'
                }}>
                  {activeFilter === "all" 
                    ? "No issues reported in your sector yet." 
                    : `No ${statusFilters.find(f => f.id === activeFilter)?.label} issues found.`}
                </h3>
                <p style={{ 
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  opacity: 0.8,
                  lineHeight: 1.5
                }}>
                  {activeFilter === "all" 
                    ? "When citizens report issues, they'll appear here." 
                    : "Try a different filter or check back later."}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: '20px',
                width: '100%'
              }}>
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue._id}
                    issue={issue}
                    isSelected={selectedIssue?._id === issue._id}
                    onClick={() => handleIssueClick(issue)}
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
              flexDirection: 'column',
              gap: '15px'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
                fontWeight: '600',
                margin: 0,
                color: '#ccd6f6',
                textAlign: 'center',
                width: '100%'
              }}>
                Gathering Requests
              </h2>
              <button
                onClick={() => setShowRequests(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#64ffda',
                  color: '#0a192f',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  minHeight: '44px',
                  boxShadow: '0 2px 10px rgba(100, 255, 218, 0.3)'
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Issues
              </button>
            </div>
            <SectorRequests />
          </div>
        )}
      </div>

      {showDashboard && (
        <DashboardSummaryModal 
          dashboardSummary={dashboardSummary} 
          onClose={() => setShowDashboard(false)} 
        />
      )}

      {showAnalytics && (
        <AnalyticsModal 
          analytics={analytics} 
          loading={loadingAnalytics}
          onClose={() => setShowAnalytics(false)} 
        />
      )}

      {showCreateCitizen && (
        <CreateCitizen 
          sectorName={sectorName} 
          onClose={() => setShowCreateCitizen(false)} 
        />
      )}

      {selectedIssue && (
        <IssueDetailsModal
          selectedIssue={selectedIssue}
          citizenDetails={citizenDetails}
          loadingCitizenDetails={loadingCitizenDetails}
          onClose={closeModal}
          onStatusChange={updateIssueStatus}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        * {
          box-sizing: border-box;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Card hover effect */
        .issue-card {
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease-out;
        }
        
        .issue-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3) !important;
        }
        
        /* Mobile menu button visibility */
        .mobile-menu-btn {
          display: none !important;
        }
        
        .mobile-nav {
          display: none !important;
        }
        
        .desktop-nav {
          display: flex !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .desktop-nav {
            gap: 8px;
          }
          
          .desktop-nav button {
            padding: 8px 12px !important;
            font-size: 13px !important;
          }
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-nav {
            display: flex !important;
          }
          
          .navbar-buttons {
            flex-direction: column;
            align-items: flex-end;
          }
          
          .filter-buttons {
            justify-content: center;
          }
          
          .filter-buttons button {
            flex: 1 0 calc(50% - 8px) !important;
            max-width: calc(50% - 8px) !important;
          }
        }
        
        @media (max-width: 480px) {
          .filter-buttons button {
            flex: 1 0 100% !important;
            max-width: 100% !important;
          }
          
          .mobile-nav div {
            grid-template-columns: 1fr !important;
          }
          
          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        
        @media (max-width: 360px) {
          .container {
            padding: 10px !important;
          }
          
          .card {
            padding: 10px !important;
          }
          
          .button-group {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
        
        /* Touch device improvements */
        @media (hover: none) {
          .issue-card:hover {
            transform: none;
          }
          
          button:active {
            transform: scale(0.98);
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .card {
            border: 2px solid #64ffda;
          }
          
          button {
            border: 2px solid currentColor;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
