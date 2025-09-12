// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     document.body.style.margin = '0';
//     document.body.style.padding = '0';
//     document.body.style.width = '100%';
//     document.body.style.overflowX = 'hidden';
//     document.body.style.backgroundColor = '#0f172a';
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!email) {
//       alert('Please enter your email address');
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       alert('Please enter a valid email address');
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const response = await axios.post(
//         'https://civicconnect-backend.onrender.com/api/citizen/forgot-password', 
//         { email }
//       );
      
//       if (response.data.success) {
//         alert('Password reset link sent successfully! Check your email.', {
//           position: "top-center",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });

//         setTimeout(() => {
//           navigate('/');
//         }, 3000);
//       } else {
//         alert(response.data.message || 'Failed to send reset link');
//       }
//     } catch (err) {
//       if (err.response) {
//         if (err.response.status === 404) {
//           alert('Email not found. Please check your email address.');
//         } else {
//           alert(err.response.data.message || 'An error occurred. Please try again.');
//         }
//       } else {
//         alert('Network error. Please check your connection.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const styles = {
//     container: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       width: '100vw',
//       background: 'linear-gradient(135deg, #0f172a, #1e293b)',
//       padding: '20px',
//     },
//     card: {
//       backgroundColor: 'rgba(15, 23, 42, 0.9)',
//       borderRadius: '40px',
//       padding: '60px',
//       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
//       backdropFilter: 'blur(50px)',
//       border: '1px solid rgba(255, 255, 255, 0.1)',
//       width: '100%',
//       maxWidth: '450px',
//       textAlign: 'center',
//     },
//     title: {
//       color: '#fff',
//       fontSize: '1.8rem',
//       marginBottom: '10px',
//     },
//     subtitle: {
//       color: 'rgba(255, 255, 255, 0.7)',
//       fontSize: '0.9rem',
//       marginBottom: '30px',
//     },
//     form: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '20px',
//     },
//     inputGroup: {
//       textAlign: 'left',
//     },
//     label: {
//       display: 'block',
//       marginBottom: '8px',
//       color: 'rgba(255, 255, 255, 0.8)',
//       fontSize: '0.9rem',
//     },
//     input: {
//       width: '92%',
//       padding: '12px 15px',
//       background: 'rgba(255, 255, 255, 0.05)',
//       border: '1px solid rgba(255, 255, 255, 0.1)',
//       borderRadius: '350px',
//       color: 'white',
//       fontSize: '0.9rem',
//     },
//     button: {
//       padding: '12px',
//       background: 'linear-gradient(135deg, #ffc550ff, #2563eb)',
//       border: 'none',
//       borderRadius: '560px',
//       color: 'white',
//       fontSize: '0.9rem',
//       fontWeight: '600',
//       cursor: 'pointer',
//       transition: 'all 0.3s ease',
//       marginTop: '10px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       maxWidth: '200px',
//       width: '100%',
//       marginLeft: '127px'
//     },
//     backButton: {
//       background: 'transparent',
//       border: 'none',
//       color: '#3b82f6',
//       cursor: 'pointer',
//       marginTop: '20px',
//       fontSize: '0.9rem',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginLeft: '175px'
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>Forgot Password</h2>
//         <p style={styles.subtitle}>Enter your email to receive a password reset link</p>
        
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Email Address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your registered email"
//               style={styles.input}
//               required
//             />
//           </div>
          
//           <button 
//             type="submit" 
//             style={styles.button} 
//             disabled={isLoading}
//           >
//             {isLoading ? 'Sending...' : 'Send Reset Link'}
//           </button>
//         </form>
        
//         <button 
//           onClick={() => navigate('/')} 
//           style={styles.backButton}
//         >
//           Back to Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        'https://civicconnect-backend.onrender.com/api/citizen/forgot-password', 
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

  // Inline styles with media queries
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
      borderRadius: '40px',
      padding: '60px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(50px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      width: '100%',
      maxWidth: '450px',
      textAlign: 'center',
      boxSizing: 'border-box',
      // Responsive adjustments
      '@media (max-width: 768px)': {
        padding: '40px 30px',
        borderRadius: '30px',
      },
      '@media (max-width: 480px)': {
        padding: '30px 20px',
        borderRadius: '20px',
      },
    },
    title: {
      color: '#fff',
      fontSize: '1.8rem',
      marginBottom: '10px',
      // Responsive adjustments
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
      // Responsive adjustments
      '@media (max-width: 480px)': {
        fontSize: '0.85rem',
        marginBottom: '20px',
      },
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      textAlign: 'left',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.9rem',
      // Responsive adjustments
      '@media (max-width: 480px)': {
        fontSize: '0.85rem',
      },
    },
    input: {
      width: '92%',
      padding: '12px 15px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '350px',
      color: 'white',
      fontSize: '0.9rem',
      boxSizing: 'border-box',
      // Responsive adjustments
      '@media (max-width: 768px)': {
        width: '90%',
      },
      '@media (max-width: 480px)': {
        width: '88%',
        padding: '10px 12px',
        fontSize: '0.85rem',
      },
    },
    button: {
      padding: '12px',
      background: 'linear-gradient(135deg, #ffc550ff, #2563eb)',
      border: 'none',
      borderRadius: '560px',
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: '200px',
      width: '100%',
      marginLeft: '127px',
      // Responsive adjustments
      '@media (max-width: 768px)': {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '180px',
      },
      '@media (max-width: 480px)': {
        maxWidth: '160px',
        padding: '10px',
        fontSize: '0.85rem',
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
      marginLeft: '175px',
      // Responsive adjustments
      '@media (max-width: 768px)': {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      '@media (max-width: 480px)': {
        fontSize: '0.85rem',
      },
    },
  };

  // Function to apply responsive styles
  const getResponsiveStyle = (baseStyle) => {
    const responsiveStyle = { ...baseStyle };
    
    // Apply media queries if they exist
    if (baseStyle['@media (max-width: 768px)']) {
      if (window.matchMedia('(max-width: 768px)').matches) {
        Object.assign(responsiveStyle, baseStyle['@media (max-width: 768px)']);
      }
    }
    
    if (baseStyle['@media (max-width: 480px)']) {
      if (window.matchMedia('(max-width: 480px)').matches) {
        Object.assign(responsiveStyle, baseStyle['@media (max-width: 480px)']);
      }
    }
    
    // Remove media query properties from the final style object
    delete responsiveStyle['@media (max-width: 768px)'];
    delete responsiveStyle['@media (max-width: 480px)'];
    
    return responsiveStyle;
  };

  return (
    <div style={getResponsiveStyle(styles.container)}>
      <div style={getResponsiveStyle(styles.card)}>
        <h2 style={getResponsiveStyle(styles.title)}>Forgot Password</h2>
        <p style={getResponsiveStyle(styles.subtitle)}>Enter your email to receive a password reset link</p>
        
        <form onSubmit={handleSubmit} style={getResponsiveStyle(styles.form)}>
          <div style={getResponsiveStyle(styles.inputGroup)}>
            <label style={getResponsiveStyle(styles.label)}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              style={getResponsiveStyle(styles.input)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={getResponsiveStyle(styles.button)} 
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/')} 
          style={getResponsiveStyle(styles.backButton)}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
