// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import HomePage from "./pages/Home";
// // import AdminDashboard from "./pages/AdminDashboard";
// // import SectorHeadDashboard from "./pages/SectorDashboard";
// // // import AdminLogin from "./pages/AdminLogin";
// // // import SectorHeadLogin from "./pages/SectorHeadLogin";

// // const AdminPrivateRoute = ({ children }) => {
// //   const token = localStorage.getItem("adminToken");
// //   return token ? children : <Navigate to="/admin-dashboard" />;
// // };

// // const SectorHeadPrivateRoute = ({ children }) => {
// //   const token = localStorage.getItem("sectorHeadToken");
// //   return token ? children : <Navigate to="/sector-head-login" />;
// // };

// // export default function App() {
// //   return (
// //     <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
// //       <Router>
// //         <Routes>
// //           <Route path="/" element={<HomePage />} />
// //           <Route
// //             path="/admin-dashboard"
// //             element={
// //               <AdminPrivateRoute>
// //                 <AdminDashboard />
// //               </AdminPrivateRoute>
// //             }
// //           />
// //           <Route
// //             path="/sector-dashboard"
// //             element={
// //               <SectorHeadPrivateRoute>
// //                 <SectorHeadDashboard />
// //               </SectorHeadPrivateRoute>
// //             }
// //           />
// //           <Route path="*" element={<Navigate to="/" />} />
// //         </Routes>
// //       </Router>
// //     </div>
// //   );
// // }

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import SectorHeadHome from "./pages/SectorHead/Sector-Home";
import BroadcastPage from "./pages/SectorHead/BroadcastPage";
// import CitizenDashboard from "./pages/CitizenDashboard/CitizenDashboard";
import CitizenDashboard from "./pages/citizenDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SectorHeadResetPassword from "./pages/SectorHeadResetPassword";
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="https://civicconnect-nfew.onrender.com" />;
};
const CitizenPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("citizenToken"); // Assuming you use 'citizenToken' for citizens
  return token ? children : <Navigate to="https://civicconnect-nfew.onrender.com" />;
};



export default function App() {
  return (
    
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Router>
        <Routes>
          <Route path="https://civicconnect-nfew.onrender.com/" element={<HomePage />} />
          <Route path="https://civicconnect-nfew.onrender.com/forgot-password" element={<ForgotPassword />} />
          <Route path="https://civicconnect-nfew.onrender.com/reset-password/:token" element={<ResetPassword />} />
          <Route path="https://civicconnect-nfew.onrender.com/sector-head/reset-password/:token" element={<SectorHeadResetPassword />} />
          <Route
            path="https://civicconnect-nfew.onrender.com/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="https://civicconnect-nfew.onrender.com/sectorHead-dashboard"
            element={
              <PrivateRoute>
                <SectorHeadHome />
              </PrivateRoute>
            }
          />
          <Route
            path="https://civicconnect-nfew.onrender.com/send-broadcast"
            element={
              <PrivateRoute>
                <BroadcastPage />
              </PrivateRoute>
            }
          />
<Route
  path="https://civicconnect-nfew.onrender.com/citizen-dashboard"
  element={
    <PrivateRoute>
      <CitizenDashboard />
    </PrivateRoute>
  }
/>
        </Routes>
      </Router>
    </div>
  );
} 

