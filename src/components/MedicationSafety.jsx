import { useContext, useMemo, useState } from 'react';
import { ClinicalContext } from './ClinicalContext';
import './HealthcareDashboard.css';

const hospitals = [
  { id: 'h1', name: 'Aster AI Medical Center', rating: 4.8, distance: '1.6 km', doctors: 18 },
  { id: 'h2', name: 'Apollo SmartCare Hospital', rating: 4.7, distance: '2.4 km', doctors: 24 },
  { id: 'h3', name: 'MedNova Emergency Institute', rating: 4.6, distance: '3.1 km', doctors: 16 },
];

const doctorProfiles = [
  { id: 'd1', name: 'Dr. Ananya Rao', experience: '12 years', fee: 900, availability: 'Today, 6:30 PM', initials: 'AR' },
  { id: 'd2', name: 'Dr. Vikram Mehta', experience: '15 years', fee: 1100, availability: 'Tomorrow, 10:00 AM', initials: 'VM' },
  { id: 'd3', name: 'Dr. Sana Kapoor', experience: '9 years', fee: 1250, availability: 'Today, 8:00 PM', initials: 'SK' },
];

const timeSlots = ['09:30 AM', '11:00 AM', '02:30 PM', '05:00 PM', '07:30 PM'];

const titleCase = (value) =>
  value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getSpecialist = (disease, symptoms, category) => {
  const source = `${disease} ${category} ${symptoms.join(' ')}`.toLowerCase();

  if (source.includes('cardio') || source.includes('heart') || source.includes('chest') || source.includes('hypertension')) {
    return {
      title: 'Cardiologist',
      reason: 'Chest, heart, or hypertension-related symptoms need cardiac review.',
    };
  }

  if (source.includes('skin') || source.includes('rash')) {
    return {
      title: 'Dermatologist',
      reason: 'Skin symptoms need allergy, infection, or inflammation review.',
    };
  }

  if (source.includes('pulmon') || source.includes('respiratory') || source.includes('cough') || source.includes('fever')) {
    return {
      title: 'Pulmonologist',
      reason: 'Respiratory symptoms need lung and airway evaluation.',
    };
  }

  if (source.includes('neuro') || source.includes('migraine') || source.includes('headache')) {
    return {
      title: 'Neurologist',
      reason: 'Headache or neurological symptoms need specialist review.',
    };
  }

  return {
    title: 'General Physician',
    reason: 'General symptoms need first-line clinical consultation.',
  };
};

const getSeverity = (confidence) => {
  if (confidence >= 70) return 'High Risk';
  if (confidence >= 40) return 'Medium Risk';
  return 'Low Risk';
};

const saveAppointment = (receipt) => {
  const existing = JSON.parse(localStorage.getItem('aiHealthcareAppointments') || '[]');
  localStorage.setItem('aiHealthcareAppointments', JSON.stringify([receipt, ...existing]));
};

export default function MedicationSafety() {
  const { analysisData } = useContext(ClinicalContext);
  const [patientName, setPatientName] = useState('Demo Patient');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const topDisease = analysisData?.predictedDiseases?.[0] || null;
  const symptoms = useMemo(
    () => analysisData?.selectedSymptoms || [],
    [analysisData]
  );

  const specialist = useMemo(
    () => getSpecialist(topDisease?.name || '', symptoms, topDisease?.category || ''),
    [topDisease, symptoms]
  );

  const severity = getSeverity(topDisease?.confidence || 0);
  const doctors = doctorProfiles.map((doctor) => ({
    ...doctor,
    specialization: specialist.title,
    match: Math.min(99, (topDisease?.confidence || 45) + 8),
  }));

  const bookingStep = !selectedHospital ? 1 : !selectedDoctor ? 2 : !selectedDate ? 3 : !selectedTime ? 4 : !receipt ? 5 : 6;

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
        serviceType: 'Doctor Appointment',
        disease: topDisease.name,
        date: selectedDate,
        time: selectedTime,
        fee: selectedDoctor.fee,
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
      'AI Healthcare Doctor Appointment Receipt',
      `Appointment ID: ${receipt.id}`,
      `Patient Name: ${receipt.patientName}`,
      `Hospital Name: ${receipt.hospitalName}`,
      `Doctor Name: ${receipt.doctorName}`,
      `Specialist: ${receipt.specialist}`,
      `Disease: ${receipt.disease}`,
      `Date: ${receipt.date}`,
      `Time: ${receipt.time}`,
      `Fee: Rs.${receipt.fee}`,
      `Status: ${receipt.status}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.id}-doctor-appointment.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!topDisease) {
    return (
      <div className="ai-health-shell">
        <section className="ai-hero">
          <div className="ai-hero-panel">
            <p className="ai-kicker">Doctor Appointment</p>
            <h1>Run Symptom Analysis first.</h1>
            <p className="ai-hero-copy">
              Doctor appointment booking depends on the latest disease prediction and symptoms from Symptom Analysis.
            </p>
          </div>
          <div className="ai-card ai-visual-card">
            <div className="ai-skeleton" />
            <div className="ai-skeleton" />
            <div className="ai-skeleton" />
            <p className="ai-muted">Waiting for symptom tracker data.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ai-health-shell">
      <section className="ai-hero">
        <div className="ai-hero-panel">
          <p className="ai-kicker">Doctor Appointment</p>
          <h1>Book the right specialist from your Symptom Analysis result.</h1>
          <p className="ai-hero-copy">
            Predicted disease: {topDisease.name}. Recommended doctor: {specialist.title}. Severity: {severity}.
          </p>
          <div className="ai-hero-actions">
            {symptoms.map((symptom) => <span className="ai-chip" key={symptom}>{titleCase(symptom)}</span>)}
          </div>
        </div>
        <div className="ai-card ai-visual-card">
          <div>
            <p className="ai-kicker">AI Specialist Match</p>
            <div className="ai-stat-value">{specialist.title}</div>
            <p className="ai-muted">{specialist.reason}</p>
          </div>
          <div className="ai-visual-wave" />
        </div>
      </section>

      <section className="ai-grid">
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Predicted Disease</div>
          <div className="ai-stat-value">{topDisease.name}</div>
          <p className="ai-stat-note">{topDisease.category}</p>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Confidence</div>
          <div className="ai-stat-value">{topDisease.confidence}%</div>
          <p className="ai-stat-note">From Symptom Analysis</p>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Severity</div>
          <div className={`ai-stat-value ${severity === 'High Risk' ? 'ai-status-high' : severity === 'Medium Risk' ? 'ai-status-medium' : 'ai-status-low'}`}>{severity}</div>
          <p className="ai-stat-note">Used for appointment priority</p>
        </div>
        <div className="ai-stat-card span-3">
          <div className="ai-stat-label">Doctor Type</div>
          <div className="ai-stat-value">{specialist.title}</div>
          <p className="ai-stat-note">Appropriate specialist only</p>
        </div>

        <div className="ai-card span-12">
          <div className="ai-section-title">
            <div>
              <h2>Step 1: Select Hospital</h2>
              <p>Choose a hospital for doctor appointment booking.</p>
            </div>
          </div>
          <div className="ai-grid">
            {hospitals.map((hospital) => (
              <article className="ai-hospital-card ai-card span-4" key={hospital.id}>
                <h3>{hospital.name}</h3>
                <div className="ai-hospital-meta">
                  <span>Rating: {hospital.rating}/5</span>
                  <span>Distance: {hospital.distance}</span>
                  <span>Available Doctors: {hospital.doctors}</span>
                  <span>{severity === 'High Risk' ? 'Priority Slot' : 'Regular Slot'}</span>
                </div>
                <button
                  className="ai-primary-btn"
                  onClick={() => {
                    setSelectedHospital(hospital);
                    setSelectedDoctor(null);
                    setReceipt(null);
                  }}
                >
                  Select Hospital
                </button>
              </article>
            ))}
          </div>
        </div>

        {selectedHospital && (
          <div className="ai-card span-12">
            <div className="ai-section-title">
              <div>
                <h2>Step 2: Select {specialist.title}</h2>
                <p>Only appropriate doctors are shown for {topDisease.name}.</p>
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
                    <span>AI Match: {doctor.match}%</span>
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
                <h2>Doctor Appointment Booking</h2>
                <p>Step {bookingStep} of 6: hospital, doctor, date, time, summary, and demo payment.</p>
              </div>
              <span className="ai-chip">Frontend demo payment</span>
            </div>
            <div className="ai-stepper">
              {[1, 2, 3, 4, 5, 6].map((step) => <div key={step} className={`ai-step ${bookingStep >= step ? 'active' : ''}`} />)}
            </div>

            <div className="ai-form-grid">
              <label>
                <span className="ai-muted">Patient Name</span>
                <input className="ai-input" value={patientName} onChange={(event) => setPatientName(event.target.value)} />
              </label>
              <label>
                <span className="ai-muted">Choose Date</span>
                <input className="ai-input" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
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
                    <h2>Appointment Summary</h2>
                    <p>Demo payment only. No backend or real transaction.</p>
                  </div>
                  <strong>Rs.{selectedDoctor.fee}</strong>
                </div>
                <ul className="ai-list" style={{ marginBottom: 16 }}>
                  <li className="ai-list-item">
                    <span>Hospital</span>
                    <strong>{selectedHospital.name}</strong>
                  </li>
                  <li className="ai-list-item">
                    <span>Doctor</span>
                    <strong>{selectedDoctor.name}</strong>
                  </li>
                  <li className="ai-list-item">
                    <span>Specialization</span>
                    <strong>{selectedDoctor.specialization}</strong>
                  </li>
                  <li className="ai-list-item">
                    <span>Date and Time</span>
                    <strong>{selectedDate} at {selectedTime}</strong>
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
                    <p>Saved to Health History using localStorage.</p>
                  </div>
                  <button className="ai-secondary-btn" onClick={downloadReceipt}>Download Receipt</button>
                </div>
                {Object.entries({
                  'Appointment ID': receipt.id,
                  'Patient Name': receipt.patientName,
                  'Hospital Name': receipt.hospitalName,
                  'Doctor Name': receipt.doctorName,
                  Specialist: receipt.specialist,
                  Disease: receipt.disease,
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
