import React from 'react';

export default function HomeDashboard({
  authenticatedUser,
  setCurrentTab
}) {

  const stats = [
    {
      title: 'Symptom Analyses',
      value: '1,248',
      subtitle: 'Total assessments performed',
      icon: '🩺'
    },
    {
      title: 'Medication Reviews',
      value: '856',
      subtitle: 'Safety evaluations completed',
      icon: '💊'
    },
    {
      title: 'Diagnostic Accuracy',
      value: '94%',
      subtitle: 'Prediction confidence rate',
      icon: '📈'
    },
    {
      title: 'AI Response Time',
      value: '1.2s',
      subtitle: 'Average analysis duration',
      icon: '⚡'
    }
  ];

  const services = [
    {
      icon: '🩺',
      title: 'Symptom Analysis',
      description:
        'Identify possible health conditions based on symptoms.',
      tab: 'symptom_checker'
    },
    {
      icon: '💊',
      title: 'Medication Safety',
      description:
        'Review medicines using patient constraints and safety checks.',
      tab: 'medication_safety'
    },
    {
      icon: '📈',
      title: 'Diagnostic Insights',
      description:
        'Visualize disease confidence and diagnostic patterns.',
      tab: 'diagnostic_insights'
    },
    {
      icon: '♟️',
      title: 'Treatment Strategy',
      description:
        'Explore AI-driven treatment decision strategies.',
      tab: 'nim'
    }
  ];

  return (
    <div style={styles.container}>

      {/* HERO */}

      <div style={styles.heroSection}>
        <h1 style={styles.title}>
          Welcome, Dr. {authenticatedUser}
        </h1>

        <p style={styles.subtitle}>
          Empowering healthcare decisions with
          intelligent symptom analysis, medication
          safety evaluation and AI-powered
          diagnostic support.
        </p>
      </div>

      {/* STATS */}

      <div style={styles.statsGrid}>
        {stats.map((item, index) => (
          <div
            key={index}
            style={styles.statCard}
          >
            <div style={styles.statIcon}>
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <h1 style={styles.statValue}>
              {item.value}
            </h1>

            <p>{item.subtitle}</p>
          </div>
        ))}
      </div>

      {/* SERVICES */}

      <h2 style={styles.sectionTitle}>
        Healthcare Services
      </h2>

      <div style={styles.servicesGrid}>
        {services.map((service, index) => (
          <div
            key={index}
            style={styles.serviceCard}
          >
            <div style={styles.serviceIcon}>
              {service.icon}
            </div>

            <h3>
              {service.title}
            </h3>

            <p>
              {service.description}
            </p>

            <button
              style={styles.actionButton}
              onClick={() =>
                setCurrentTab(service.tab)
              }
            >
              Open Module →
            </button>
          </div>
        ))}
      </div>

      {/* FEATURES */}

      <h2 style={styles.sectionTitle}>
        AI Capabilities
      </h2>

      <div style={styles.featuresGrid}>

        <div style={styles.featureCard}>
          ✓ Symptom Understanding
        </div>

        <div style={styles.featureCard}>
          ✓ Medication Validation
        </div>

        <div style={styles.featureCard}>
          ✓ Clinical Decision Support
        </div>

        <div style={styles.featureCard}>
          ✓ Explainable AI Reasoning
        </div>

        <div style={styles.featureCard}>
          ✓ Risk Assessment
        </div>

        <div style={styles.featureCard}>
          ✓ Diagnostic Visualization
        </div>

      </div>

      {/* FOOTER */}

      <div style={styles.footer}>
        <h3>
          Healthcare AI Assistant v1.0
        </h3>

        <p>
          Intelligent Healthcare Support Platform
          powered by Artificial Intelligence and
          Explainable Reasoning.
        </p>
      </div>

    </div>
  );
}

const styles = {

  container: {
    padding: '20px'
  },

  heroSection: {
    background:
      'linear-gradient(135deg,#2563eb,#1e40af)',
    color: 'white',
    padding: '35px',
    borderRadius: '20px',
    marginBottom: '25px'
  },

  title: {
    margin: 0,
    fontSize: '34px'
  },

  subtitle: {
    marginTop: '12px',
    fontSize: '16px',
    maxWidth: '700px'
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(220px,1fr))',
    gap: '20px',
    marginBottom: '30px'
  },

  statCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow:
      '0 4px 12px rgba(0,0,0,0.08)'
  },

  statIcon: {
    fontSize: '35px'
  },

  statValue: {
    color: '#2563eb'
  },

  sectionTitle: {
    marginBottom: '15px',
    color: '#0f172a'
  },

  servicesGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(260px,1fr))',
    gap: '20px',
    marginBottom: '35px'
  },

  serviceCard: {
    background: '#fff',
    padding: '25px',
    borderRadius: '16px',
    boxShadow:
      '0 4px 12px rgba(0,0,0,0.08)'
  },

  serviceIcon: {
    fontSize: '40px'
  },

  actionButton: {
    marginTop: '15px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer'
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(250px,1fr))',
    gap: '15px'
  },

  featureCard: {
    background: '#fff',
    padding: '18px',
    borderRadius: '12px',
    boxShadow:
      '0 4px 12px rgba(0,0,0,0.08)'
  },

  footer: {
    marginTop: '35px',
    textAlign: 'center',
    color: '#64748b'
  }

};