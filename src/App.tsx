import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Legal from "./pages/Legal";
import CGV from "./pages/CGV";
import FAQ from "./pages/FAQ";
import CameleonAlgo from "./pages/CameleonAlgo";
import ScrollToTop from "./components/ScrollToTop";

// Funnel and other pages
import LandingPage from "./pages/funnel/LandingPage";
import SalesPage from "./pages/funnel/SalesPage";
import CheckoutPage from "./pages/funnel/CheckoutPage";
import ThankYouPage from "./pages/funnel/ThankYouPage";
import ThalamusPage from "./pages/ThalamusPage";
import FormationView from "./pages/FormationView";
import PsychologyProduct from "./pages/PsychologyProduct";
import CameleonProduct from "./pages/CameleonProduct";
import Support from "./pages/Support";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import MemberArea from "./pages/MemberArea";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <div className="bg-ngt-black min-h-screen selection:bg-ngt-gold selection:text-ngt-black">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/espace-membre" element={<MemberArea />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cameleon-algo" element={<CameleonAlgo />} />
          
          {/* Funnel & Additional Routes */}
          <Route path="/formation-gratuite" element={<LandingPage />} />
          <Route path="/plan-cameleon" element={<SalesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/merci" element={<ThankYouPage />} />
          <Route path="/thalamus-ia" element={<ThalamusPage />} />
          <Route path="/formation/:token" element={<FormationView />} />
          <Route path="/formation-psychologie" element={<PsychologyProduct />} />
          <Route path="/formation-cameleon" element={<CameleonProduct />} />
          <Route path="/support" element={<Support />} />
        </Routes>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
