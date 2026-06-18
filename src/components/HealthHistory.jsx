import { useMemo, useState } from 'react';
import './HealthcareDashboard.css';

const readAppointments = () => {
  try {
    return JSON.parse(localStorage.getItem('aiHealthcareAppointments') || '[]');
  } catch {
    return [];
  }
};

export default function HealthHistory() {
  const [appointments, setAppointments] = useState(() => readAppointments());

  const stats = useMemo(() => {
    const doctors = new Set(appointments.map((item) => item.doctorName));
    const diseases = new Set(appointments.map((item) => item.disease));
    const payments = appointments.reduce((sum, item) => sum + Number(item.fee || 0), 0);

    return {
      consultations: appointments.length,
      doctors: doctors.size,
      diseases: diseases.size,
      payments,
    };
  }, [appointments]);

  return (
    <div className="ai-health-shell">
      <section className="ai-hero">
        <div className="ai-hero-panel">
          <p className="ai-kicker">Longitudinal Care Timeline</p>
          <h1>Health History</h1>
          <p className="ai-hero-copy">
            A local patient record of appointments, payments, doctors visited, disease history, and consultation status.
          </p>
        </div>
        <div className="ai-card ai-visual-card">
          <div>
            <p className="ai-kicker">Saved Records</p>
            <div className="ai-stat-value">{appointments.length}</div>
            <p className="ai-muted">Stored securely in browser localStorage for demo presentation.</p>
          </div>
          <button
            className="ai-secondary-btn"
            onClick={() => {
              localStorage.removeItem('aiHealthcareAppointments');
              setAppointments([]);
            }}
          >
            Clear Demo History
          </button>
        </div>
      </section>

      <section className="ai-grid">
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Previous Consultations</div>
          <div className="ai-stat-value">{stats.consultations}</div>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Past Diseases</div>
          <div className="ai-stat-value">{stats.diseases}</div>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Doctors Visited</div>
          <div className="ai-stat-value">{stats.doctors}</div>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Payments</div>
          <div className="ai-stat-value">₹{stats.payments}</div>
        </div>

        <div className="ai-card span-12">
          <div className="ai-section-title">
            <div>
              <h2>Consultation Timeline</h2>
              <p>Receipts generated after payment appear here automatically.</p>
            </div>
          </div>

          {appointments.length === 0 ? (
            <div className="ai-alert">No appointments saved yet. Book a demo appointment from Diagnostic Insights.</div>
          ) : (
            <div className="ai-timeline">
              {appointments.map((item) => (
                <article className="ai-timeline-item" key={item.id}>
                  <div className="ai-section-title">
                    <div>
                      <h3>{item.disease}</h3>
                      <p>{item.hospitalName} with {item.doctorName}</p>
                    </div>
                    <span className="ai-chip">{item.status}</span>
                  </div>
                  <div className="ai-hospital-meta">
                    <span>Date: {item.date}</span>
                    <span>Time: {item.time}</span>
                    <span>Specialist: {item.specialist}</span>
                    <span>Payment: ₹{item.fee}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
