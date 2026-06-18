import { useContext, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ClinicalContext } from './ClinicalContext';
import './HealthcareDashboard.css';

const hospitals = [
  { id: 'h1', name: 'Aster AI Medical Center', rating: 4.8, distance: '1.6 km', doctors: 18 },
  { id: 'h2', name: 'Apollo SmartCare Hospital', rating: 4.7, distance: '2.4 km', doctors: 24 },
  { id: 'h3', name: 'MedNova Emergency Institute', rating: 4.6, distance: '3.1 km', doctors: 16 },
];

const doctorDirectory = [
  { id: 'd1', name: 'Dr. Ananya Rao', experience: '12 years', fee: 900, availability: 'Today, 6:30 PM', initials: 'AR' },
  { id: 'd2', name: 'Dr. Vikram Mehta', experience: '15 years', fee: 1100, availability: 'Tomorrow, 10:00 AM', initials: 'VM' },
  { id: 'd3', name: 'Dr. Sana Kapoor', experience: '9 years', fee: 1250, availability: 'Today, 8:00 PM', initials: 'SK' },
];

const timeSlots = ['09:30 AM', '11:00 AM', '02:30 PM', '05:00 PM', '07:30 PM'];

const getCheckupMeta = (screening, index) => {
  const lower = screening.toLowerCase();

  if (lower.includes('x-ray') || lower.includes('mri') || lower.includes('echo')) {
    return { fee: 1200 + index * 150, duration: '30 to 45 min', department: 'Radiology' };
  }

  if (lower.includes('ecg') || lower.includes('blood pressure')) {
    return { fee: 650 + index * 100, duration: '15 to 20 min', department: 'Cardiac Diagnostics' };
  }

  if (lower.includes('cbc') || lower.includes('electrolytes') || lower.includes('culture')) {
    return { fee: 500 + index * 100, duration: '20 to 30 min', department: 'Laboratory' };
  }

  if (lower.includes('oximetry') || lower.includes('pcr')) {
    return { fee: 450 + index * 120, duration: '10 to 20 min', department: 'Respiratory Lab' };
  }

  return { fee: 700 + index * 100, duration: '20 to 30 min', department: 'Clinical Diagnostics' };
};

const titleCase = (value) =>
  value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getSeverity = (confidence) => {
  if (confidence >= 70) return 'High Risk';
  if (confidence >= 40) return 'Medium Risk';
  return 'Low Risk';
};

const getSpecialist = (disease, symptoms, category) => {
  const source = `${disease} ${category} ${symptoms.join(' ')}`.toLowerCase();

  if (source.includes('cardio') || source.includes('heart') || source.includes('chest') || source.includes('hypertension')) {
    return {
      title: 'Cardiologist',
      explanation: 'The selected symptoms show cardiovascular markers, so a cardiology review is the best next step.',
    };
  }

  if (source.includes('skin') || source.includes('rash')) {
    return {
      title: 'Dermatologist',
      explanation: 'Skin-related symptoms are best reviewed by a dermatologist for allergy, infection, or inflammation.',
    };
  }

  if (source.includes('pulmon') || source.includes('respiratory') || source.includes('cough') || source.includes('fever')) {
    return {
      title: 'Pulmonologist',
      explanation: 'The symptom pattern includes respiratory indicators, so lung and airway evaluation is recommended.',
    };
  }

  if (source.includes('neuro') || source.includes('migraine') || source.includes('headache')) {
    return {
      title: 'Neurologist',
      explanation: 'Headache and neurovascular symptoms need specialist neurological assessment if persistent or severe.',
    };
  }

  return {
    title: 'General Physician',
    explanation: 'The selected symptoms are broad, so a general physician can coordinate first-line examination.',
  };
};

const saveAppointment = (receipt) => {
  const existing = JSON.parse(localStorage.getItem('aiHealthcareAppointments') || '[]');
  localStorage.setItem('aiHealthcareAppointments', JSON.stringify([receipt, ...existing]));
};

export default function DiagnosticInsights() {
  const { analysisData } = useContext(ClinicalContext);
  const [patientName, setPatientName] = useState('Demo Patient');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedCheckupIds, setSelectedCheckupIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const topDisease = analysisData?.predictedDiseases?.[0] || null;
  const symptoms = useMemo(
    () => analysisData?.selectedSymptoms || [],
    [analysisData]
  );
  const confidence = topDisease?.confidence || 0;
  const severity = getSeverity(confidence);
  const specialist = useMemo(
    () => getSpecialist(topDisease?.name || '', symptoms, topDisease?.category || ''),
    [topDisease, symptoms]
  );

  const symptomAnalytics = useMemo(() => {
    const total = Math.max(symptoms.length, 1);

    return symptoms.map((symptom, index) => {
      const symptomName = titleCase(symptom);
      const knownMatch = topDisease?.name
        ? confidence
        : 0;
      const severityScore = Math.min(100, Math.max(18, Math.round((knownMatch || 35) - index * 7 + symptom.length * 2)));

      return {
        symptom: symptomName,
        severity: severityScore,
        contribution: Math.round(100 / total),
      };
    });
  }, [confidence, symptoms, topDisease]);

  const riskBreakdown = useMemo(() => {
    const cspScore = topDisease?.medicationAnalysis?.score ?? 70;
    return [
      { name: 'Diagnosis Confidence', value: confidence, color: '#22d3ee' },
      { name: 'Symptom Load', value: Math.min(100, symptoms.length * 16), color: '#f97316' },
      { name: 'Medication Risk', value: Math.max(0, 100 - cspScore), color: '#a78bfa' },
    ].filter((item) => item.value > 0);
  }, [confidence, symptoms.length, topDisease]);

  const trendData = useMemo(() => {
    const base = Math.max(10, confidence - 28);
    return ['Scan 1', 'Scan 2', 'Scan 3', 'Scan 4', 'Current'].map((label, index) => ({
      day: label,
      risk: Math.min(100, base + index * Math.max(5, symptoms.length * 3)),
    }));
  }, [confidence, symptoms.length]);

  const doctors = doctorDirectory.map((doctor) => ({
    ...doctor,
    specialization: specialist.title,
  }));

  const recommendedCheckups = useMemo(() => (
    (topDisease?.screenings || []).map((screening, index) => ({
      id: `${screening}-${index}`,
      name: screening,
      reason: `Recommended for ${topDisease.name} confirmation`,
      ...getCheckupMeta(screening, index),
    }))
  ), [topDisease]);

  const activeCheckups = useMemo(() => {
    if (!recommendedCheckups.length) return [];

    const selectedIds = selectedCheckupIds.length
      ? selectedCheckupIds
      : recommendedCheckups.map((checkup) => checkup.id);

    return recommendedCheckups.filter((checkup) => selectedIds.includes(checkup.id));
  }, [recommendedCheckups, selectedCheckupIds]);

  const checkupFee = activeCheckups.reduce((sum, checkup) => sum + checkup.fee, 0);
  const totalFee = (selectedDoctor?.fee || 0) + checkupFee;
  const bookingStep = !selectedHospital ? 1 : !selectedDoctor ? 2 : !selectedDate ? 3 : !selectedTime ? 4 : !receipt ? 5 : 6;

  const toggleCheckup = (checkupId) => {
    const currentIds = selectedCheckupIds.length
      ? selectedCheckupIds
      : recommendedCheckups.map((checkup) => checkup.id);

    const nextIds = currentIds.includes(checkupId)
      ? currentIds.filter((id) => id !== checkupId)
      : [...currentIds, checkupId];

    setSelectedCheckupIds(nextIds.length ? nextIds : [checkupId]);
    setReceipt(null);
  };

  const completePayment = () => {
    if (!selectedHospital || !selectedDoctor || !selectedDate || !selectedTime || !topDisease) return;

    setLoading(true);
    window.setTimeout(() => {
      const nextReceipt = {
        id: `APT-${Date.now().toString().slice(-6)}`,
        patientName,
        hospitalName: selectedHospital.name,
        doctorName: selectedDoctor.name,
        specialist: selectedDoctor.specialization,
        serviceType: 'Hospital Checkup + Doctor Appointment',
        checkups: activeCheckups.map((checkup) => checkup.name),
        disease: topDisease.name,
        date: selectedDate,
        time: selectedTime,
        fee: totalFee,
        status: 'Paid and Confirmed',
      };

      saveAppointment(nextReceipt);
      setReceipt(nextReceipt);
      setLoading(false);
    }, 700);
  };

  const downloadReceipt = () => {
    if (!receipt) return;

    const lines = [
      'AI Healthcare Appointment Receipt',
      `Appointment ID: ${receipt.id}`,
      `Patient Name: ${receipt.patientName}`,
      `Hospital Name: ${receipt.hospitalName}`,
      `Doctor Name: ${receipt.doctorName}`,
      `Service Type: ${receipt.serviceType}`,
      `Checkups: ${(receipt.checkups || []).join(', ')}`,
      `Date: ${receipt.date}`,
      `Time: ${receipt.time}`,
      `Fee: Rs.${receipt.fee}`,
      `Status: ${receipt.status}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.id}-receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!topDisease) {
    return (
      <div className="ai-health-shell">
        <section className="ai-hero">
          <div className="ai-hero-panel">
            <p className="ai-kicker">AI Diagnostic Center</p>
            <h1>Run Symptom Analysis first to generate diagnostic insights.</h1>
            <p className="ai-hero-copy">
              Select symptoms in the Symptom Analysis page and click Run AI Diagnosis. This page will then render disease prediction, confidence, severity, charts, specialist matching, and hospital recommendations from that result.
            </p>
          </div>
          <div className="ai-card ai-visual-card">
            <div className="ai-skeleton" />
            <div className="ai-skeleton" />
            <div className="ai-skeleton" />
            <p className="ai-muted">Waiting for live symptom tracker data.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ai-health-shell">
      <section className="ai-hero">
        <div className="ai-hero-panel">
          <p className="ai-kicker">AI Diagnostic Center</p>
          <h1>Live diagnostic insights generated from Symptom Analysis.</h1>
          <p className="ai-hero-copy">
            This dashboard is using the latest symptom tracker result from {analysisData.generatedAt ? new Date(analysisData.generatedAt).toLocaleString() : 'this session'}.
          </p>
          <div className="ai-hero-actions">
            {symptoms.map((symptom) => <span className="ai-chip" key={symptom}>{titleCase(symptom)}</span>)}
          </div>
        </div>
        <div className="ai-card ai-visual-card">
          <div className="ai-visual-orbit" />
          <div className="ai-visual-wave" />
          <p className="ai-muted">AI signal scan complete. Diagnostic confidence is based on the selected symptoms only.</p>
        </div>
      </section>

      {severity === 'High Risk' && (
        <div className="ai-alert">
          Emergency alert: high-risk case detected from Symptom Analysis. Nearby hospital and specialist recommendation modules are active.
        </div>
      )}

      <section className="ai-grid">
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Predicted Disease</div>
          <div className="ai-stat-value">{topDisease.name}</div>
          <p className="ai-stat-note">{topDisease.category}</p>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Confidence</div>
          <div className="ai-stat-value">{confidence}%</div>
          <p className="ai-stat-note">From symptom match score</p>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Severity</div>
          <div className={`ai-stat-value ${severity === 'High Risk' ? 'ai-status-high' : severity === 'Medium Risk' ? 'ai-status-medium' : 'ai-status-low'}`}>{severity}</div>
          <p className="ai-stat-note">{severity === 'Low Risk' ? 'Self-care suggested' : severity === 'Medium Risk' ? 'Consultation suggested' : 'Escalation required'}</p>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Recommended Specialist</div>
          <div className="ai-stat-value">{specialist.title}</div>
          <p className="ai-stat-note">{specialist.explanation}</p>
        </div>

        <div className="ai-card span-7">
          <div className="ai-section-title">
            <div>
              <h2>Symptom Severity Chart</h2>
              <p>Rendered from symptoms entered in Symptom Analysis: {symptoms.map(titleCase).join(', ')}.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={symptomAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.14)" />
              <XAxis dataKey="symptom" />
              <YAxis />
              <Tooltip contentStyle={{ background: '#06111f', border: '1px solid rgba(125,211,252,.25)', color: '#fff' }} />
              <Bar dataKey="severity" radius={[8, 8, 0, 0]} fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ai-card span-5">
          <div className="ai-section-title">
            <div>
              <h2>Risk Breakdown</h2>
              <p>Calculated from confidence, symptom count, and medication safety score.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={riskBreakdown} dataKey="value" innerRadius={62} outerRadius={96} paddingAngle={4}>
                {riskBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#06111f', border: '1px solid rgba(125,211,252,.25)', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="ai-list">
            {riskBreakdown.map((item) => (
              <li className="ai-list-item" key={item.name}>
                <span>{item.name}</span>
                <strong>{item.value}%</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="ai-card span-6">
          <div className="ai-section-title">
            <div>
              <h2>Symptom Contribution Analysis</h2>
              <p>Each selected symptom contributes to the live diagnosis result.</p>
            </div>
          </div>
          <ul className="ai-list">
            {symptomAnalytics.map((item) => (
              <li className="ai-list-item" key={item.symptom}>
                <span>{item.symptom}</span>
                <div style={{ minWidth: 160 }}>
                  <div className="ai-progress-track">
                    <div className="ai-progress-fill" style={{ width: `${item.contribution}%` }} />
                  </div>
                </div>
                <strong>{item.contribution}%</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="ai-card span-6">
          <div className="ai-section-title">
            <div>
              <h2>Symptom Trend Graph</h2>
              <p>Trend is derived from current confidence and symptom load.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.14)" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip contentStyle={{ background: '#06111f', border: '1px solid rgba(125,211,252,.25)', color: '#fff' }} />
              <Area type="monotone" dataKey="risk" stroke="#22d3ee" fill="url(#riskGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {severity === 'Low Risk' && (
          <div className="ai-card span-12">
            <h2>Self-care Suggestions</h2>
            <p className="ai-muted">Hydrate well, rest, monitor symptoms, and rerun Symptom Analysis if symptoms change. Hospital booking is not shown because this result is low risk.</p>
          </div>
        )}

        {severity === 'Medium Risk' && (
          <div className="ai-card span-12">
            <h2>Consultation Recommended</h2>
            <p className="ai-muted">Book a non-emergency hospital checkup and {specialist.title} consultation for confirmation.</p>
          </div>
        )}

        {severity !== 'Low Risk' && (
          <div className="ai-card span-12">
            <div className="ai-section-title">
              <div>
                <h2>Hospital Checkup Booking</h2>
                <p>Only relevant checkups from Symptom Analysis are included for {topDisease.name}.</p>
              </div>
            </div>
            <div className="ai-grid" style={{ marginBottom: 18 }}>
              {recommendedCheckups.map((checkup) => {
                const active = activeCheckups.some((item) => item.id === checkup.id);

                return (
                  <article className="ai-hospital-card ai-card span-4" key={checkup.id}>
                    <div className="ai-section-title">
                      <h3>{checkup.name}</h3>
                      <input
                        aria-label={`Select ${checkup.name}`}
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleCheckup(checkup.id)}
                      />
                    </div>
                    <p className="ai-muted">{checkup.reason}</p>
                    <div className="ai-hospital-meta">
                      <span>{checkup.department}</span>
                      <span>{checkup.duration}</span>
                      <span>Rs.{checkup.fee}</span>
                      <span>AI Relevant</span>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="ai-grid">
              {hospitals.map((hospital) => (
                <article className="ai-hospital-card ai-card span-4" key={hospital.id}>
                  <h3>{hospital.name}</h3>
                  <div className="ai-hospital-meta">
                    <span>Rating: {hospital.rating}/5</span>
                    <span>Distance: {hospital.distance}</span>
                    <span>Available Doctors: {hospital.doctors}</span>
                    <span>Emergency: Open</span>
                  </div>
                  <button
                    className="ai-primary-btn"
                    onClick={() => {
                      setSelectedHospital(hospital);
                      setSelectedDoctor(null);
                      setReceipt(null);
                    }}
                  >
                    Select Hospital Checkup
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}

        {selectedHospital && (
          <div className="ai-card span-12">
            <div className="ai-section-title">
              <div>
                <h2>Appropriate Doctor Appointment</h2>
                <p>Showing only {specialist.title} doctors for {topDisease.name} at {selectedHospital.name}.</p>
              </div>
              <button className="ai-ghost-btn" onClick={() => setSelectedHospital(null)}>Change Hospital</button>
            </div>
            <div className="ai-grid">
              {doctors.map((doctor) => (
                <article className="ai-doctor-card ai-card span-4" key={doctor.id}>
                  <div className="ai-doctor-top">
                    <div className="ai-doctor-avatar">{doctor.initials}</div>
                    <div>
                      <h3>{doctor.name}</h3>
                      <p className="ai-muted">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="ai-doctor-meta">
                    <span>{doctor.experience}</span>
                    <span>Rs.{doctor.fee}</span>
                    <span>{doctor.availability}</span>
                    <span>AI Match: {Math.min(99, confidence + 8)}%</span>
                  </div>
                  <button
                    className="ai-primary-btn"
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setReceipt(null);
                    }}
                  >
                    Select Doctor
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}

        {selectedHospital && selectedDoctor && (
          <div className="ai-booking-panel ai-card span-12">
            <div className="ai-section-title">
              <div>
                <h2>Appointment Booking Flow</h2>
                <p>Step {bookingStep} of 6: Hospital checkup, appropriate doctor, date, time, summary, and demo payment.</p>
              </div>
              <span className="ai-chip">Secure demo checkout</span>
            </div>
            <div className="ai-stepper">
              {[1, 2, 3, 4, 5, 6].map((step) => <div key={step} className={`ai-step ${bookingStep >= step ? 'active' : ''}`} />)}
            </div>

            <div className="ai-form-grid">
              <label>
                <span className="ai-muted">Patient Name</span>
                <input className="ai-input" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
              </label>
              <label>
                <span className="ai-muted">Choose Date</span>
                <input className="ai-input" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </label>
            </div>

            {selectedDate && (
              <div style={{ marginTop: 16 }}>
                <p className="ai-muted">Choose Time</p>
                <div className="ai-time-grid">
                  {timeSlots.map((slot) => (
                    <button
                      className={`ai-time-slot ${selectedTime === slot ? 'active' : ''}`}
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTime && !receipt && (
              <div className="ai-payment-card" style={{ marginTop: 18 }}>
                <div className="ai-section-title">
                  <div>
                    <h2>Appointment Summary and Payment</h2>
                    <p>Demo payment only. No real transaction will be processed.</p>
                  </div>
                  <strong>Rs.{totalFee}</strong>
                </div>
                <ul className="ai-list" style={{ marginBottom: 16 }}>
                  <li className="ai-list-item">
                    <span>Hospital</span>
                    <strong>{selectedHospital.name}</strong>
                  </li>
                  <li className="ai-list-item">
                    <span>Doctor</span>
                    <strong>{selectedDoctor.name} ({selectedDoctor.specialization})</strong>
                  </li>
                  <li className="ai-list-item">
                    <span>Checkups</span>
                    <strong>{activeCheckups.map((checkup) => checkup.name).join(', ')}</strong>
                  </li>
                  <li className="ai-list-item">
                    <span>Checkup Fee + Doctor Fee</span>
                    <strong>Rs.{checkupFee} + Rs.{selectedDoctor.fee}</strong>
                  </li>
                </ul>
                {loading ? (
                  <div className="ai-list">
                    <div className="ai-skeleton" />
                    <div className="ai-skeleton" />
                    <div className="ai-skeleton" />
                  </div>
                ) : (
                  <button className="ai-primary-btn" onClick={completePayment}>Pay and Confirm Appointment</button>
                )}
              </div>
            )}

            {receipt && (
              <div className="ai-receipt" style={{ marginTop: 18 }}>
                <div className="ai-section-title">
                  <div>
                    <h2>Appointment Receipt</h2>
                    <p>Your appointment has been saved to Health History.</p>
                  </div>
                  <button className="ai-secondary-btn" onClick={downloadReceipt}>Download Receipt</button>
                </div>
                {Object.entries({
                  'Appointment ID': receipt.id,
                  'Patient Name': receipt.patientName,
                  'Hospital Name': receipt.hospitalName,
                  'Doctor Name': receipt.doctorName,
                  'Service Type': receipt.serviceType,
                  Checkups: (receipt.checkups || []).join(', '),
                  Date: receipt.date,
                  Time: receipt.time,
                  Fee: `Rs.${receipt.fee}`,
                  Status: receipt.status,
                }).map(([label, value]) => (
                  <div className="ai-receipt-row" key={label}>
                    <span className="ai-muted">{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
