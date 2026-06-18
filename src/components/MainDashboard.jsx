import healthcareLogo from '../assets/healthcare-logo.png';

export default function MainDashboard({
  authenticatedUser,
  setAuthenticatedUser,
  currentTab,
  setCurrentTab,
  children
}) {

  const handleLogOutAction = () => {
    setAuthenticatedUser(null);
  };

  return (
    <div style={styles.container}>

      <header style={styles.header}>

        <div style={styles.logo}>
          <img
            src={healthcareLogo}
            alt="Healthcare AI Assistant"
            style={styles.logoImage}
          />
          <span style={styles.logoText}>Healthcare AI Assistant</span>
          🏥 Healthcare AI Assistant
        </div>

        <nav style={styles.nav}>

          <button
            style={
              currentTab === 'dashboard'
                ? styles.activeBtn
                : styles.btn
            }
            onClick={() =>
              setCurrentTab('dashboard')
            }
          >
            🏠 Overview
          </button>

          <button
            style={
              currentTab === 'symptom_checker'
                ? styles.activeBtn
                : styles.btn
            }
            onClick={() =>
              setCurrentTab('symptom_checker')
            }
          >
            🩺 Symptom Analysis
          </button>

          <button
            style={
              currentTab === 'medication_safety'
                ? styles.activeBtn
                : styles.btn
            }
            onClick={() =>
              setCurrentTab('medication_safety')
            }
          >
            💊 Medication Safety
          </button>

          <button
            style={
              currentTab === 'diagnostic_insights'
                ? styles.activeBtn
                : styles.btn
            }
            onClick={() =>
              setCurrentTab('diagnostic_insights')
            }
          >
            📈 Diagnostic Insights
          </button>

          <button
            style={
              currentTab === 'health_history'
                ? styles.activeBtn
                : styles.btn
            }
            onClick={() =>
              setCurrentTab('health_history')
            }
          >
            Health History
          </button>

          <button
            style={
              currentTab === 'nim'
                ? styles.activeBtn
                : styles.btn
            }
            onClick={() =>
              setCurrentTab('nim')
            }
          >
            ♟ Treatment Strategy
          </button>

        </nav>

        <div style={styles.rightSection}>

          <span style={styles.userName}>
            👨‍⚕️ {authenticatedUser}
          </span>

          <button
            style={styles.logoutBtn}
            onClick={handleLogOutAction}
          >
            Log Out
          </button>

        </div>

      </header>

      <main style={styles.main}>
        {children}
      </main>

    </div>
  );
}

const styles = {

  container: {
    minHeight: '100vh',
    background: '#f8fafc'
  },

  header: {
    minHeight: '80px',
    background: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    padding: '14px 30px',
    flexWrap: 'wrap',
    boxShadow:
      '0 4px 10px rgba(0,0,0,0.1)'
  },

  logo: {
    color: '#ffffff',
    fontSize: 0,
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  logoImage: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid rgba(125, 211, 252, 0.35)',
    boxShadow: '0 0 20px rgba(34, 211, 238, 0.18)'
  },

  logoText: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '700'
  },

  nav: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },

  btn: {
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: '0.3s'
  },

  activeBtn: {
    background: '#2563eb',
    border: 'none',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },

  userName: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600'
  },

  logoutBtn: {
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  main: {
    padding: '25px'
  }

};
