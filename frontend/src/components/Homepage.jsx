import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LineChart,
  PieChart,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Silky, subtle animations
  const animation = useMemo(
    () => ({
      fadeUp: {
        hidden: { opacity: 0, y: 15 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { duration: 0.5, ease: "easeOut" } 
        },
      },
      stagger: {
        visible: { transition: { staggerChildren: 0.08 } },
      },
      scaleIn: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
          opacity: 1, 
          scale: 1, 
          transition: { duration: 0.5, ease: "easeOut" } 
        },
      }
    }),
    []
  );

  const smoothScroll = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="ww-page">
      {/* Header */}
      <header className={`ww-header ${scrolled ? "scrolled" : ""}`}>
        <div className="ww-container ww-nav">
          <div className="ww-brand" onClick={() => smoothScroll("top")}>
            <div className="ww-logo-icon">
              <Wallet size={20} />
            </div>
            <span className="ww-logo-text">WalletWise</span>
          </div>

          <nav className={`ww-nav-links ${isMenuOpen ? "is-open" : ""}`}>
            <button onClick={() => smoothScroll("features")}>Features</button>
            <button onClick={() => smoothScroll("how")}>How it Works</button>
            <button onClick={() => smoothScroll("testimonials")}>Stories</button>
          </nav>

          <div className="ww-nav-actions">
            <button className="ww-btn-link" onClick={() => navigate("/login")}>Log in</button>
            <button className="ww-btn ww-btn-primary" onClick={() => navigate("/signup")}>
              Get Started
            </button>
            <button 
              className="ww-menu-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="ww-hero">
          <div className="ww-container ww-hero-grid">
            <motion.div
              className="ww-hero-content"
              initial="hidden"
              animate="visible"
              variants={animation.stagger}
            >
              <motion.div className="ww-pill" variants={animation.fadeUp}>
                <Sparkles size={14} className="ww-pill-icon" />
                <span>Smart finance for students</span>
              </motion.div>
              
              <motion.h1 className="ww-hero-title" variants={animation.fadeUp}>
                Master your money <br />
                <span className="text-gradient">without the stress.</span>
              </motion.h1>
              
              <motion.p className="ww-hero-sub" variants={animation.fadeUp}>
                The minimalist expense tracker designed for modern student life.
                Track budgets, predict expenses, and build wealth—automatically.
              </motion.p>
              
              <motion.div className="ww-hero-cta" variants={animation.fadeUp}>
                <button className="ww-btn ww-btn-primary ww-btn-lg" onClick={() => navigate("/signup")}>
                  Start for free <ChevronRight size={18} />
                </button>
                <div className="ww-hero-proof">
                  <div className="ww-avatars">
                    {[1,2,3].map(i => <div key={i} className="ww-avatar" />)}
                  </div>
                  <span>Trusted by 2,000+ students</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Dashboard Mockup - purely CSS/HTML for cleanliness */}
            <motion.div
              className="ww-hero-visual"
              initial="hidden"
              animate="visible"
              variants={animation.scaleIn}
            >
              <div className="ww-mockup-card">
                <div className="ww-mockup-header">
                  <div className="ww-mockup-dot red"></div>
                  <div className="ww-mockup-dot yellow"></div>
                  <div className="ww-mockup-dot green"></div>
                </div>
                <div className="ww-mockup-body">
                   <div className="ww-widget-grid">
                      <div className="ww-widget total">
                         <span className="ww-label">Total Balance</span>
                         <h3>$2,450.00</h3>
                         <div className="ww-trend positive">+12% this month</div>
                      </div>
                      <div className="ww-widget graph">
                        <div className="ww-graph-lines">
                          <span style={{height: '40%'}}></span>
                          <span style={{height: '70%'}}></span>
                          <span style={{height: '50%'}}></span>
                          <span style={{height: '85%'}}></span>
                          <span style={{height: '60%'}}></span>
                        </div>
                      </div>
                      <div className="ww-widget list">
                        <div className="ww-list-item">
                           <div className="icon-box coffee"><Zap size={14}/></div>
                           <div className="text"><span>Coffee</span><small>Today</small></div>
                           <div className="amount">-$4.50</div>
                        </div>
                        <div className="ww-list-item">
                           <div className="icon-box sub"><CreditCard size={14}/></div>
                           <div className="text"><span>Netflix</span><small>Yesterday</small></div>
                           <div className="amount">-$12.99</div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="ww-section" id="features">
          <div className="ww-container">
            <div className="ww-section-header">
              <h2>Everything you need. <span className="text-muted">Nothing you don't.</span></h2>
              <p>Clarity comes from simplicity. We stripped away the noise.</p>
            </div>
            
            <motion.div 
              className="ww-bento-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={animation.stagger}
            >
              {[
                { 
                  icon: <PieChart size={24} />, 
                  title: "Smart Budgeting", 
                  desc: "Budgets that auto-adjust to your spending habits.",
                  col: "span-2"
                },
                { 
                  icon: <Zap size={24} />, 
                  title: "Instant Capture", 
                  desc: "Log expenses in seconds.",
                  col: "span-1"
                },
                { 
                  icon: <Brain size={24} />, 
                  title: "AI Insights", 
                  desc: "Get nudges before you overspend on weekend plans.",
                  col: "span-1"
                },
                { 
                  icon: <ShieldCheck size={24} />, 
                  title: "Bank Grade Security", 
                  desc: "Your data is encrypted and never sold.",
                  col: "span-2"
                },
              ].map((item, i) => (
                <motion.div key={i} className={`ww-bento-card ${item.col}`} variants={animation.fadeUp}>
                  <div className="ww-card-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works - Step Timeline */}
        <section className="ww-section ww-bg-subtle" id="how">
           <div className="ww-container">
              <div className="ww-section-header centered">
                <h2>From chaos to clarity in 3 steps</h2>
              </div>
              <div className="ww-steps-wrapper">
                 {[
                   { title: "Connect", text: "Link your accounts or set manual limits." },
                   { title: "Track", text: "We categorize your spending automatically." },
                   { title: "Grow", text: "Watch your savings goals hit 100%." }
                 ].map((step, index) => (
                   <div className="ww-step-item" key={index}>
                      <div className="ww-step-number">0{index + 1}</div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Minimal CTA */}
        <section className="ww-section ww-cta-section">
          <motion.div 
            className="ww-cta-box"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Stop wondering where your money went.</h2>
            <p>Join WalletWise today and take control.</p>
            <button className="ww-btn ww-btn-white" onClick={() => navigate("/signup")}>
              Create Free Account
            </button>
          </motion.div>
        </section>
      </main>

      <footer className="ww-footer">
        <div className="ww-container">
          <div className="ww-footer-content">
             <div className="ww-brand-footer">
               <Wallet size={18} /> WalletWise
             </div>
             <div className="ww-footer-links">
               <a href="#">Privacy</a>
               <a href="#">Terms</a>
               <a href="#">Contact</a>
             </div>
             <div className="ww-copy">© 2026 WalletWise Inc.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;