import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Travel from "@/pages/Travel";
import Works from "@/pages/Works";
import Message from "@/pages/Message";
import SiteMap from "@/pages/SiteMap";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Admin from "@/pages/Admin";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aboutme" element={<Home />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/works" element={<Works />} />
              <Route path="/message" element={<Message />} />
              <Route path="/sitemap" element={<SiteMap />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
