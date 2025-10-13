import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const backend_URL = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.backgroundColor = '#0f172a';
    
    // Cleanup function to reset styles when component unmounts
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.width = '';
      document.body.style.overflowX = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${backend_URL}/api/citizen/forgot-password`,
        { email }
      );
      
      if (response.data.success) {
        alert('Password reset link sent successfully! Check your email.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        alert(response.data.message || 'Failed to send reset link');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          alert('Email not found. Please check your email address.');
        } else {
          alert(err.response.data.message || 'An error occurred. Please try again.');
        }
      } else {
        alert('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Responsive styles
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      padding: '20px',
      boxSizing: 'border-box',
    },
    card: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderRadius: '20px',
      padding: '40px 30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(50px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      width: '100%',
      maxWidth: '450px',
      textAlign: 'center',
      boxSizing: 'border-box',
      // Responsive adjustments
      '@media (max-width: 480px)': {
        padding: '30px 20px',
        borderRadius: '15px',
      },
    },
    title: {
      color: '#fff',
      fontSize: '1.8rem',
      marginBottom: '10px',
      fontWeight: '600',
      // Responsive font size
      '@media (max-width: 768px)': {
        fontSize: '1.6rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '1.4rem',
      },
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.9rem',
      marginBottom: '30px',
      lineHeight: '1.4',
      // Responsive adjustments
      '@media (max-width: 480px)': {
        fontSize: '0.85rem',
        marginBottom: '25px',
      },
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
    },
    inputGroup: {
      textAlign: 'left',
      width: '100%',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.9rem',
      fontWeight: '500',
      // Responsive adjustments
      '@media (max-width: 480px)': {
        fontSize: '0.85rem',
      },
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '25px',
      color: 'white',
      fontSize: '0.9rem',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease',
      // Responsive adjustments
      '@media (max-width: 480px)': {
        padding: '10px 15px',
        fontSize: '0.85rem',
      },
    },
    button: {
      padding: '12px',
      background: 'linear-gradient(135deg, #ffc550ff, #2563eb)',
      border: 'none',
      borderRadius: '25px',
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '200px',
      margin: '10px auto 0',
      // Responsive adjustments
      '@media (max-width: 480px)': {
        padding: '10px',
        fontSize: '0.85rem',
        maxWidth: '180px',
      },
      // Hover effect
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
      },
      // Disabled state
      ':disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none',
      },
    },
    backButton: {
      background: 'transparent',
      border: 'none',
      color: '#3b82f6',
      cursor: 'pointer',
      marginTop: '20px',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      textDecoration: 'underline',
      transition: 'color 0.3s ease',
      // Responsive adjustments
      '@media (max-width: 480px)': {
        fontSize: '0.85rem',
        marginTop: '15px',
      },
      // Hover effect
      ':hover': {
        color: '#60a5fa',
      },
    },
  };

  // Inline styles with media queries
  const getResponsiveStyles = () => {
    return {
      container: {
        ...styles.container,
      },
      card: {
        ...styles.card,
        borderRadius: window.innerWidth <= 480 ? '15px' : '20px',
        padding: window.innerWidth <= 480 ? '30px 20px' : '40px 30px',
      },
      title: {
        ...styles.title,
        fontSize: window.innerWidth <= 480 ? '1.4rem' : window.innerWidth <= 768 ? '1.6rem' : '1.8rem',
      },
      subtitle: {
        ...styles.subtitle,
        fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
        marginBottom: window.innerWidth <= 480 ? '25px' : '30px',
      },
      label: {
        ...styles.label,
        fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
      },
      input: {
        ...styles.input,
        padding: window.innerWidth <= 480 ? '10px 15px' : '12px 15px',
        fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
      },
      button: {
        ...styles.button,
        padding: window.innerWidth <= 480 ? '10px' : '12px',
        fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
        maxWidth: window.innerWidth <= 480 ? '180px' : '200px',
      },
      backButton: {
        ...styles.backButton,
        fontSize: window.innerWidth <= 480 ? '0.85rem' : '0.9rem',
        marginTop: window.innerWidth <= 480 ? '15px' : '20px',
      },
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <div style={responsiveStyles.container}>
      <div style={responsiveStyles.card}>
        <h2 style={responsiveStyles.title}>Forgot Password</h2>
        <p style={responsiveStyles.subtitle}>Enter your email to receive a password reset link</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={responsiveStyles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              style={responsiveStyles.input}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              ...responsiveStyles.button,
              transform: isLoading ? 'none' : '',
              boxShadow: isLoading ? 'none' : '',
            }}
            disabled={isLoading}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/')} 
          style={responsiveStyles.backButton}
          disabled={isLoading}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.target.style.color = '#60a5fa';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.target.style.color = '#3b82f6';
            }
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
