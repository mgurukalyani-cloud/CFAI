import { useEffect, useState } from 'react';
// పాత లైన్ తీసేసి ఇలా రాయండి
import { ClinicalProvider } from './components/ClinicalContext';
import Login from './components/Login';
import MainDashboard from './components/MainDashboard';
import HomeDashboard from './components/HomeDashboard';
import SymptomTracker from './components/SymptomTracker';
import AdversarialNim from './components/AdversarialNim';
import MedicationSafety from './components/MedicationSafety';
import DiagnosticInsights from './components/DiagnosticInsights';
import HealthHistory from './components/HealthHistory';
import healthcareLogo from './assets/healthcare-logo.png';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [scoreIQ, setScoreIQ] = useState(120);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(splashTimer);
  }, []);

  const handleIQAdjustment = (delta) => {
    setScoreIQ((prev) => Math.min(180, Math.max(50, prev + delta)));
  };

  const handleLoginSuccessCallback = (doctorName) => {
    setAuthenticatedUser(doctorName);
    setScoreIQ(120);
    setCurrentTab('dashboard');
  };

  if (showSplash) {
    return (
      <div style={styles.splashScreen}>
        <img src={healthcareLogo} alt="Smart Healthcare System" style={styles.splashImage} />
        <div style={styles.splashOverlay}>
          <div style={styles.splashBadge}>AI Healthcare Platform</div>
          <h1 style={styles.splashTitle}>Smart Healthcare System</h1>
          <p style={styles.splashText}>Loading clinical intelligence dashboard...</p>
          <div style={styles.splashLoader}>
            <span style={styles.splashLoaderFill} />
          </div>
        </div>
      </div>
    );
  }

  if (!authenticatedUser) {
    return <Login onLoginSuccess={handleLoginSuccessCallback} />;
  }

  return (
    <ClinicalProvider> {/* ఇక్కడ డేటా ఫ్లో స్టార్ట్ అవుతుంది */}
      <MainDashboard
        authenticatedUser={authenticatedUser}
        setAuthenticatedUser={setAuthenticatedUser}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        scoreIQ={scoreIQ}
        theme={theme}
        setTheme={setTheme}
      >
        {currentTab === 'dashboard' && <HomeDashboard authenticatedUser={authenticatedUser} setCurrentTab={setCurrentTab} />}
        {currentTab === 'symptom_checker' && <SymptomTracker theme={theme} />}
        {currentTab === 'medication_safety' && <MedicationSafety />}
        {currentTab === 'diagnostic_insights' && <DiagnosticInsights />}
        {currentTab === 'health_history' && <HealthHistory />}
        {currentTab === 'nim' && <AdversarialNim onIQChange={handleIQAdjustment} />}
      </MainDashboard>
    </ClinicalProvider>
  );
}

const styles = {
  splashScreen: {
    position: 'fixed',
    inset: 0,
    minHeight: '100vh',
    overflow: 'hidden',
    background: '#020617',
    display: 'grid',
    placeItems: 'center'
  },
  splashImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.9
  },
  splashOverlay: {
    position: 'relative',
    zIndex: 1,
    transform: 'translateY(190px)',
    width: 'min(720px, 90vw)',
    padding: '34px',
    borderRadius: '8px',
    color: '#ffffff',
    textAlign: 'center',
    background: 'rgba(2, 6, 23, 0.62)',
    border: '1px solid rgba(125, 211, 252, 0.25)',
    boxShadow: '0 30px 90px rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(12px)'
  },
  splashBadge: {
    display: 'inline-flex',
    padding: '8px 14px',
    borderRadius: '999px',
    color: '#a5f3fc',
    background: 'rgba(14, 165, 233, 0.18)',
    border: '1px solid rgba(125, 211, 252, 0.3)',
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  splashTitle: {
    margin: '18px 0 8px',
    fontSize: 'clamp(34px, 6vw, 62px)',
    lineHeight: 1.05,
    letterSpacing: 0
  },
  splashText: {
    margin: '0 0 22px',
    color: '#dbeafe',
    fontSize: '16px'
  },
  splashLoader: {
    height: '8px',
    borderRadius: '999px',
    overflow: 'hidden',
    background: 'rgba(148, 163, 184, 0.28)'
  },
  splashLoaderFill: {
    display: 'block',
    height: '100%',
    width: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #22d3ee, #2563eb, #f87171)'
  }
};
