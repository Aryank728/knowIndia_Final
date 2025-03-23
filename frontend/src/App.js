import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  console.log("App component rendered");
  
  return (
    <ThemeProvider>
      <Router>
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
