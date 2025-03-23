import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import Home from "./pages/home.jsx";
import IndiaMapPage from "./pages/IndiaMap.jsx";
import StatePage from "./pages/StatePage.jsx"; // Component for individual state pages
import AboutUs from "./pages/AboutUs.jsx"; // Import About Us page
import ContactUs from "./pages/ContactUs.jsx"; // Import Contact Us page
import Constitution from "./pages/constitution.jsx"; // Import Constitution page
import TestKnowIndia from "./pages/TestKnowIndia.jsx"; // Import test component
import { ThemeProvider } from "./context/ThemeContext.jsx"; // Import ThemeProvider
import { syncPendingFeedback, hasPendingFeedback } from "./utils/feedbackSync.js"; // Import feedback sync utility

// ScrollToTop component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Component to handle feedback sync on app startup
function FeedbackSyncHandler() {
  useEffect(() => {
    // Check if there's any pending feedback to sync
    const checkForPendingFeedback = async () => {
      if (hasPendingFeedback()) {
        console.log("Found pending feedback, attempting to sync...");
        try {
          const result = await syncPendingFeedback();
          if (result.success) {
            console.log(`Successfully synced ${result.synced} feedback items`);
            if (result.failed > 0) {
              console.warn(`Failed to sync ${result.failed} feedback items`);
            }
          } else {
            console.error("Failed to sync feedback:", result.errors);
          }
        } catch (error) {
          console.error("Error syncing feedback:", error);
        }
      }
    };

    // Wait a bit for the app to initialize before checking
    const syncTimer = setTimeout(() => {
      checkForPendingFeedback();
    }, 5000); // 5 second delay to avoid interfering with initial app load

    // Set up periodic checks for syncing feedback
    const periodicSyncTimer = setInterval(() => {
      checkForPendingFeedback();
    }, 60000); // Check every minute

    return () => {
      clearTimeout(syncTimer);
      clearInterval(periodicSyncTimer);
    };
  }, []);

  return null;
}

function App() {
  console.log("App component rendered");
  
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <FeedbackSyncHandler />
        <div className="flex flex-col min-h-screen dark:bg-gray-900 transition-colors duration-300">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/places" element={<IndiaMapPage />} />
              <Route path="/places/:stateName" element={<StatePage />} />
              <Route path="/constitution" element={<Constitution />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/test-knowindia" element={<TestKnowIndia />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
