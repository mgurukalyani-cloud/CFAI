import { useState, useEffect } from 'react';
import heartAsset from '../assets/CFAI.png';

export default function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. INITIAL LOAD: బ్రౌజర్ రీఫ్రెష్ చేసినప్పుడు లోకల్ స్టోరేజ్ నుండి రిజిస్టర్డ్ యూజర్ల డేటాను లోడ్ చేస్తుంది.
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    // Default account if no database matrix exists yet
    return [{ email: 'doctor@gmail.com', password: 'password123', name: 'Dr. Admin' }];
  });

  // Forces zero-scroll boundaries to fit beautifully onto monitor screens without cut-offs
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100vw";
    document.body.style.height = "100vh";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      setError('Access Restricted: A valid @gmail.com account is required.');
      return;
    }

    if (password.length < 6) {
      setError('Security Notice: Password must contain at least 6 characters.');
      return;
    }

    // --- MODE 1: REGISTER / CREATE ACCOUNT HANDLER ---
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Validation Error: Passwords do not match.');
        return;
      }

      // Check if user account already exists in state storage
      const userExists = registeredUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setError('Error: This account already exists! Switch to Login.');
        return;
      }

      // 2. STATE & STORAGE PERSISTENCE: కొత్త యూజర్‌ను స్టేట్ మరియు లోకల్ స్టోరేజ్ రెండింటిలోనూ సేవ్ చేస్తున్నాం.
      const newUser = { email: email.toLowerCase(), password, name: fullName || 'Dr. Professional' };
      const updatedUsersList = [...registeredUsers, newUser];
      
      setRegisteredUsers(updatedUsersList);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsersList));

      setSuccess('Account created successfully! Switching to Login...');
      setTimeout(() => {
        setIsSignUp(false);
        setSuccess('');
        setError('');
        setPassword('');
        setConfirmPassword('');
      }, 2000);

    // --- MODE 2: SIGN IN / VALIDATION HANDLER ---
    } else {
      // Find matching credentials inside stored React dynamic list
      const matchedUser = registeredUsers.find(
        user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );

      if (!matchedUser) {
        setError('Authentication Failed: Account does not exist or incorrect credentials!');
        return;
      }

      setError('');
      setSuccess('Access Granted. Entering portal...');
      setTimeout(() => {
        onLoginSuccess(matchedUser.name);
      }, 500);
    }
  };

  return (
    <div style={styles.fullscreenBackground}>
      <div style={styles.workspaceCard}>
        
        {/* LEFT PANEL: BLUE HERO BACKGROUND */}
        <div style={styles.leftHeroColumn}>
          <div style={styles.brandingRow}>
            <svg style={styles.brandIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span style={styles.brandText}>Smart Health Checkup</span>
          </div>
          
          <h1 style={styles.heroMainTitle}>
            Clinical Diagnostic &<br />Probabilistic Inference Model
          </h1>
          
          <p style={styles.heroParagraph}>
            An advanced AI framework specialized in computing Joint Probability Distributions and Marginalization parameters under uncertainty.
          </p>
        </div>

        {/* RIGHT PANEL: MEDICAL ACCOUNT INTERACTIVE CONSOLE */}
        <div style={styles.rightAuthColumn}>
          <div style={styles.formContainerCard}>
            
            <div style={styles.imageAssetWrapper}>
              <img 
                src={heartAsset} 
                alt="Clinical Inference Graphical Architecture Map" 
                style={styles.renderedAssetImage} 
              />
            </div>

            <div style={styles.formContentWrapper}>
              <h2 style={styles.welcomeText}>
                {isSignUp ? 'Create Account' : 'Welcome Doctor'}
              </h2>
              
              {error && <div style={styles.errorAlertElement}>{error}</div>}
              {success && <div style={styles.successAlertElement}>{success}</div>}

              <form onSubmit={handleSubmit} style={styles.formElement}>
                
                {isSignUp && (
                  <div style={styles.inputFieldGroup}>
                    <div style={styles.labelRow}>
                      <label style={styles.inputLabel}>FULL NAME</label>
                      <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Dr. Alexander Fleming"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={styles.textInputField}
                      required
                    />
                  </div>
                )}

                <div style={styles.inputFieldGroup}>
                  <div style={styles.labelRow}>
                    <label style={styles.inputLabel}>USER ID / CLINICAL EMAIL</label>
                    <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="doctor@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.textInputField}
                    required
                  />
                </div>

                <div style={styles.inputFieldGroup}>
                  <div style={styles.labelRow}>
                    <label style={styles.inputLabel}>SECURITY PASSWORD</label>
                    <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.textInputField}
                    required
                  />
                </div>

                {isSignUp && (
                  <div style={styles.inputFieldGroup}>
                    <div style={styles.labelRow}>
                      <label style={styles.inputLabel}>CONFIRM PASSWORD</label>
                      <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={styles.textInputField}
                      required
                    />
                  </div>
                )}

                <button type="submit" style={styles.submitActionButton}>
                  {isSignUp ? 'Register Account' : 'Sign In to Portal'}
                </button>
              </form>

              <div style={styles.toggleContextContainer}>
                {isSignUp ? (
                  <span>
                    Already registered?{' '}
                    <span onClick={handleToggleMode} style={styles.interactiveLink}>
                      Login here
                    </span>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <span onClick={handleToggleMode} style={styles.interactiveLink}>
                      Create Account
                    </span>
                  </span>
                )}
              </div>

              <div style={styles.accessGatewayNotice}>
                Secure Gateway • Authorized Clinical Access Only
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  fullscreenBackground: { height: '100vh', width: '100vw', maxHeight: '100vh', maxWidth: '100vw', backgroundColor: '#ffffff', fontFamily: '"SF Pro Display", -apple-system, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', overflow: 'hidden', position: 'fixed', top: 0, left: 0 },
  workspaceCard: { width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden', boxSizing: 'border-box' },
  leftHeroColumn: { width: '50vw', height: '100vh', backgroundColor: '#0062cc', backgroundImage: 'linear-gradient(135deg, #0056b3 0%, #0062cc 50%, #1e88e5 100%)', padding: '0 8%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#ffffff', position: 'relative' },
  brandingRow: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' },
  brandIcon: { width: '32px', height: '32px', color: '#ffffff' },
  brandText: { fontSize: '24px', fontWeight: '700', color: '#ffffff' },
  heroMainTitle: { margin: '0 0 20px 0', fontSize: '44px', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-1.5px' },
  heroParagraph: { margin: '0', fontSize: '16px', lineHeight: '1.6', color: '#f0f7ff', maxWidth: '520px' },
  rightAuthColumn: { width: '50vw', height: '100vh', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' },
  formContainerCard: { width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)', overflow: 'hidden', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
  imageAssetWrapper: { width: '100%', height: '240px', backgroundColor: '#f1f5f9', overflow: 'hidden', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  renderedAssetImage: { width: '100%', height: '100%', objectFit: 'cover' },
  formContentWrapper: { padding: '24px 32px 28px 32px', boxSizing: 'border-box' },
  welcomeText: { margin: '0 0 16px 0', fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' },
  errorAlertElement: { backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', fontWeight: '500' },
  successAlertElement: { backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', fontWeight: '500' },
  formElement: { display: 'flex', flexDirection: 'column', gap: '12px' },
  inputFieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  inputLabel: { fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' },
  inputIcon: { width: '15px', height: '15px', color: '#0062cc' },
  textInputField: { padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff', fontFamily: 'inherit' },
  submitActionButton: { backgroundColor: '#0062cc', color: '#ffffff', padding: '12px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '6px', fontFamily: 'inherit' },
  toggleContextContainer: { textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#64748b' },
  interactiveLink: { color: '#0062cc', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' },
  accessGatewayNotice: { textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#94a3b8' }
};
