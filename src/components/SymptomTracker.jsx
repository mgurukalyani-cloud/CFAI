import { useContext, useState } from 'react';
import { ClinicalContext } from './ClinicalContext';

const CLINICAL_DIAGNOSTIC_DB = {

  'Migraine / Neurovascular Strain': {
    symptoms: [
      'headache',
      'nausea',
      'sensitivity to light',
      'migraine',
      'blurry vision'
    ],
    baseProbability: 85,
    medicines: [
      'Sumatriptan 50mg',
      'Rizatriptan 10mg',
      'Propranolol 40mg',
      'Acetaminophen 500mg',
      'Ibuprofen 400mg'
    ],
    screenings: [
      'Brain MRI',
      'Fundoscopy',
      'Neurological Mapping',
      'Visual Field Test'
    ],
    category: 'Neurological'
  },

  'Gastroenteritis / Infection': {
    symptoms: [
      'nausea',
      'fever',
      'abdominal pain',
      'diarrhea',
      'vomiting'
    ],
    baseProbability: 78,
    medicines: [
      'Ondansetron 4mg',
      'Ciprofloxacin 500mg',
      'Metronidazole 400mg',
      'ORS',
      'Loperamide 2mg'
    ],
    screenings: [
      'CBC',
      'Stool Culture',
      'Electrolytes Panel'
    ],
    category: 'Gastrointestinal'
  },

  'Acute Respiratory Infection': {
    symptoms: [
      'cough',
      'fever',
      'fatigue',
      'sore throat',
      'runny nose'
    ],
    baseProbability: 92,
    medicines: [
      'Amoxicillin 500mg',
      'Azithromycin 250mg',
      'Dextromethorphan Syrup',
      'Paracetamol 650mg'
    ],
    screenings: [
      'Chest X-Ray',
      'Pulse Oximetry',
      'PCR Test'
    ],
    category: 'Pulmonology'
  },

  'Hypertension Risk': {
    symptoms: [
      'headache',
      'fatigue',
      'chest tightness',
      'dizziness'
    ],
    baseProbability: 70,
    medicines: [
      'Amlodipine 5mg',
      'Losartan 50mg',
      'Metoprolol 25mg'
    ],
    screenings: [
      'ECG',
      'Blood Pressure Monitoring',
      'Echocardiogram'
    ],
    category: 'Cardiovascular'
  }

};

const PRESET_SYMPTOMS = [

  {
    id: 'headache',
    label: '🤕 Headache'
  },

  {
    id: 'nausea',
    label: '🤢 Nausea'
  },

  {
    id: 'sensitivity to light',
    label: '☀️ Photophobia'
  },

  {
    id: 'fever',
    label: '🌡️ Fever'
  },

  {
    id: 'abdominal pain',
    label: '🤒 Abdominal Pain'
  },

  {
    id: 'cough',
    label: '😷 Cough'
  },

  {
    id: 'fatigue',
    label: '🥱 Fatigue'
  },

  {
    id: 'chest tightness',
    label: '🫀 Chest Tightness'
  }

];

export default function SymptomTracker() {

  const { setAnalysisData } =
    useContext(ClinicalContext);

  const [selectedSymptoms,
    setSelectedSymptoms] =
    useState([]);

  const [customSymptomInput,
    setCustomSymptomInput] =
    useState('');

  const [predictedDiseases,
    setPredictedDiseases] =
    useState([]);

  const [isLightMode,
    setIsLightMode] =
    useState(false);

  // Patient Profile

  const [patientAge,
    setPatientAge] =
    useState('');

  const [allergy,
    setAllergy] =
    useState('');

  const [kidneyDisease,
    setKidneyDisease] =
    useState(false);

  const [liverDisease,
    setLiverDisease] =
    useState(false);

  const [pregnant,
    setPregnant] =
    useState(false);

  const [diabetes,
    setDiabetes] =
    useState(false);

  // BMI

  const [weightKg,
    setWeightKg] =
    useState('');

  const [heightCm,
    setHeightCm] =
    useState('');

  const [calculatedBmi,
    setCalculatedBmi] =
    useState(null);

  const [bmiCategory,
    setBmiCategory] =
    useState('');

  // Logs

  const [consoleLogs,
    setConsoleLogs] =
    useState([
      '🏥 Healthcare AI Engine Ready'
    ]);
      // ==========================
  // ACTIVITY LOG SYSTEM
  // ==========================

  const addLogMessage = (msg) => {

    setConsoleLogs((prev) => [

      msg,

      ...prev

    ].slice(0, 5));

  };

  // ==========================
  // SYMPTOM MANAGEMENT
  // ==========================

  const togglePresetSymptom =
  (
    symptomId
  ) => {

    setSelectedSymptoms(
      (prev) =>

        prev.includes(
          symptomId
        )

          ? prev.filter(
              (id) =>
                id !== symptomId
            )

          : [
              ...prev,
              symptomId
            ]
    );

  };

  const removeSymptomToken =
  (
    token
  ) => {

    setSelectedSymptoms(
      (prev) =>

        prev.filter(
          (id) =>
            id !== token
        )
    );

  };

  const handleAddCustomSymptom =
  (e) => {

    e.preventDefault();

    const cleanInput =
      customSymptomInput
        .trim()
        .toLowerCase();

    if (!cleanInput)
      return;

    if (
      selectedSymptoms.includes(
        cleanInput
      )
    ) {

      addLogMessage(
        `⚠️ ${cleanInput} already exists`
      );

      setCustomSymptomInput('');

      return;
    }

    setSelectedSymptoms(
      (prev) => [

        ...prev,

        cleanInput

      ]
    );

    addLogMessage(
      `📥 Added symptom: ${cleanInput}`
    );

    setCustomSymptomInput('');

  };

  // ==========================
  // CSP MEDICATION ENGINE
  // ==========================

  const applyMedicationConstraints =
  (
    medicines
  ) => {

    const valid = [];

    const rejected = [];

    medicines.forEach((med) => {

      let reason = '';

      // Allergy Constraint

      if (

        allergy &&
        med
          .toLowerCase()
          .includes(
            allergy.toLowerCase()
          )

      ) {

        reason =
          'Patient Allergy';

      }

      // Age Constraint

      else if (

        Number(patientAge) < 12 &&
        med.includes('500mg')

      ) {

        reason =
          'Age Restriction';

      }

      // Kidney Constraint

      else if (

        kidneyDisease &&
        (
          med.includes(
            'Ibuprofen'
          )
          ||
          med.includes(
            'Metformin'
          )
        )

      ) {

        reason =
          'Kidney Disease Risk';

      }

      // Liver Constraint

      else if (

        liverDisease &&
        (
          med.includes(
            'Paracetamol'
          )
          ||
          med.includes(
            'Acetaminophen'
          )
        )

      ) {

        reason =
          'Liver Disease Risk';

      }

      // Pregnancy Constraint

      else if (

        pregnant &&
        med.includes(
          'Ciprofloxacin'
        )

      ) {

        reason =
          'Pregnancy Restriction';

      }

      // Diabetes Constraint

      else if (

        diabetes &&
        med.includes(
          'Dextromethorphan'
        )

      ) {

        reason =
          'Diabetes Risk';

      }

      if (reason) {

        rejected.push({

          medicine: med,

          reason

        });

      }

      else {

        valid.push(
          med
        );

      }

    });

    return {

      valid,

      rejected,

      score:
        medicines.length > 0

          ? Math.round(
              (
                valid.length /
                medicines.length
              ) * 100
            )

          : 0

    };

  };

  // ==========================
  // DISEASE PREDICTION
  // ==========================

  const calculateDifferentialDiagnosis =
  () => {

    if (
      selectedSymptoms.length === 0
    ) {

      addLogMessage(
        '⚠️ No symptoms selected'
      );

      return;
    }

    const results = [];

    Object.entries(
      CLINICAL_DIAGNOSTIC_DB
    ).forEach(
      (
        [
          diseaseName,
          data
        ]
      ) => {

        const matchCount =
          data.symptoms.filter(
            (symptom) =>

              selectedSymptoms.some(
                (userSymptom) =>

                  userSymptom.includes(
                    symptom
                  )

                  ||

                  symptom.includes(
                    userSymptom
                  )
              )
          ).length;

        if (
          matchCount > 0
        ) {

          const confidence =
            Math.round(
              (
                matchCount /
                data.symptoms.length
              ) *
              data.baseProbability
            );

          results.push({

            name:
              diseaseName,

            confidence:
              Math.min(
                100,
                confidence
              ),

            medicines:
              data.medicines,

            screenings:
              data.screenings,

            category:
              data.category

          });

        }

      }
    );

    const sortedResults =
      results.sort(
        (a, b) =>
          b.confidence -
          a.confidence
      );

    setPredictedDiseases(
      sortedResults
    );

    setAnalysisData({
      selectedSymptoms,
      predictedDiseases:
        sortedResults.map((disease) => ({
          ...disease,
          medicationAnalysis:
            applyMedicationConstraints(
              disease.medicines
            )
        })),
      patientProfile: {
        age: patientAge,
        allergy,
        kidneyDisease,
        liverDisease,
        pregnant,
        diabetes,
        bmi: calculatedBmi,
        bmiCategory
      },
      generatedAt:
        new Date().toISOString()
    });

    addLogMessage(
      `🩺 ${sortedResults.length} diseases predicted`
    );

  };

  // ==========================
  // BMI ENGINE
  // ==========================

  const processBmiMetrics =
  (e) => {

    e.preventDefault();

    const weight =
      parseFloat(
        weightKg
      );

    const height =
      parseFloat(
        heightCm
      );

    if (
      !weight ||
      !height
    ) {

      addLogMessage(
        '⚠️ BMI input invalid'
      );

      return;
    }

    const bmi =
      (
        weight /
        Math.pow(
          height / 100,
          2
        )
      ).toFixed(2);

    setCalculatedBmi(
      bmi
    );

    if (bmi < 18.5)
      setBmiCategory(
        'Underweight'
      );

    else if (bmi < 25)
      setBmiCategory(
        'Normal'
      );

    else if (bmi < 30)
      setBmiCategory(
        'Overweight'
      );

    else
      setBmiCategory(
        'Obese'
      );

    addLogMessage(
      `📊 BMI calculated: ${bmi}`
    );

  };

  // ==========================
  // RESET SYSTEM
  // ==========================

  const executeSystemFlush =
  () => {

    setSelectedSymptoms([]);

    setCustomSymptomInput('');

    setPredictedDiseases([]);

    setAnalysisData(null);

    setWeightKg('');

    setHeightCm('');

    setCalculatedBmi(
      null
    );

    setBmiCategory('');

    setPatientAge('');

    setAllergy('');

    setKidneyDisease(
      false
    );

    setLiverDisease(
      false
    );

    setPregnant(
      false
    );

    setDiabetes(
      false
    );

    addLogMessage(
      '🔄 System Reset Completed'
    );

  };
    // ==========================
  // THEME CONFIGURATION
  // ==========================

  const currentTheme = {

    background:
      isLightMode
        ? '#f8fafc'
        : '#030712',

    text:
      isLightMode
        ? '#0f172a'
        : '#f8fafc',

    subText:
      isLightMode
        ? '#475569'
        : '#94a3b8',

    cardBg:
      isLightMode
        ? '#ffffff'
        : '#111827',

    cardBorder:
      isLightMode
        ? '#cbd5e1'
        : '#1e293b',

    inputBg:
      isLightMode
        ? '#f1f5f9'
        : '#090d16',

    inputBorder:
      isLightMode
        ? '#94a3b8'
        : '#334155',

    symptomTileBg:
      isLightMode
        ? '#f1f5f9'
        : '#1f2937',

    symptomTileText:
      isLightMode
        ? '#334155'
        : '#e2e8f0'

  };

  return (

    <div
      style={{
        ...styles.dashboardContainerLayoutFrame,
        backgroundColor:
          currentTheme.background,
        color:
          currentTheme.text
      }}
    >

      {/* HEADER */}

      <div
        style={{
          ...styles.topHeaderTitleRow,
          borderColor:
            currentTheme.cardBorder
        }}
      >

        <div>

          <h2
            style={{
              ...styles.mainCoreTitleHeader,
              color:
                currentTheme.text
            }}
          >
            🩺 AI Symptom Analysis Engine
          </h2>

          <p
            style={{
              ...styles.subHeaderSubtitle,
              color:
                currentTheme.subText
            }}
          >
            Disease Prediction +
            Medication Safety +
            Constraint Satisfaction
          </p>

        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px'
          }}
        >

          <button
            onClick={() =>
              setIsLightMode(
                !isLightMode
              )
            }
            style={
              styles.themeToggleBtn
            }
          >
            {
              isLightMode
                ? '🌙 Dark'
                : '☀️ Light'
            }
          </button>

          <button
            onClick={
              executeSystemFlush
            }
            style={
              styles.globalFlushBtn
            }
          >
            Reset 🔄
          </button>

        </div>

      </div>

      {/* MAIN GRID */}

      <div
        style={
          styles.workspaceSplitGridRow
        }
      >

        {/* LEFT PANEL */}

        <div
          style={
            styles.leftMainWorkspacePanel
          }
        >

          <div
            style={{
              ...styles.clinicalCardFrame,
              backgroundColor:
                currentTheme.cardBg,
              borderColor:
                currentTheme.cardBorder
            }}
          >

            <span
              style={
                styles.sectionTitleLabelText
              }
            >
              🤒 Select Symptoms
            </span>

            <div
              style={
                styles.interactiveGridMeshSystemBlocks
              }
            >

              {
                PRESET_SYMPTOMS.map(
                  (symptom) => {

                    const active =
                      selectedSymptoms.includes(
                        symptom.id
                      );

                    return (

                      <div
                        key={
                          symptom.id
                        }
                        onClick={() =>
                          togglePresetSymptom(
                            symptom.id
                          )
                        }
                        style={{
                          ...styles.capsuleGridBlockUnitCell,

                          backgroundColor:
                            active
                              ? '#dbeafe'
                              : currentTheme.symptomTileBg,

                          borderColor:
                            active
                              ? '#2563eb'
                              : currentTheme.cardBorder
                        }}
                      >

                        <span
                          style={
                            styles.emojiDisplay
                          }
                        >
                          {
                            symptom.label.split(
                              ' '
                            )[0]
                          }
                        </span>

                        <span
                          style={{
                            ...styles.symptomTextLabel,
                            color:
                              currentTheme.symptomTileText
                          }}
                        >
                          {
                            symptom.label
                              .split(' ')
                              .slice(1)
                              .join(' ')
                          }
                        </span>

                      </div>

                    );

                  }
                )
              }

            </div>

            {/* CUSTOM SYMPTOM */}

            <form
              onSubmit={
                handleAddCustomSymptom
              }
              style={{
                display:'flex',
                gap:'12px',
                marginTop:'18px'
              }}
            >

              <input
                type="text"
                value={
                  customSymptomInput
                }
                onChange={(e)=>
                  setCustomSymptomInput(
                    e.target.value
                  )
                }
                placeholder="Add Custom Symptom"
                style={{
                  ...styles.customTextInputControl,
                  backgroundColor:
                    currentTheme.inputBg,
                  borderColor:
                    currentTheme.inputBorder,
                  color:
                    currentTheme.text
                }}
              />

              <button
                type="submit"
                style={
                  styles.addTokenInlineBtn
                }
              >
                Add
              </button>

            </form>

            {/* ACTIVE SYMPTOMS */}

            {
              selectedSymptoms.length > 0 &&
              (

                <div
                  style={{
                    ...styles.activeTokenPoolWrapper,
                    backgroundColor:
                      currentTheme.inputBg,
                    borderColor:
                      currentTheme.cardBorder
                  }}
                >

                  <div
                    style={
                      styles.poolHeaderTitle
                    }
                  >
                    Active Symptoms
                  </div>

                  <div
                    style={{
                      display:'flex',
                      flexWrap:'wrap',
                      gap:'10px'
                    }}
                  >

                    {
                      selectedSymptoms.map(
                        (
                          symptom,
                          index
                        ) => (

                          <div
                            key={index}
                            style={
                              styles.symptomBadgeToken
                            }
                          >

                            {symptom}

                            <button
                              onClick={() =>
                                removeSymptomToken(
                                  symptom
                                )
                              }
                              style={
                                styles.tokenDismissCrossBtn
                              }
                            >
                              ×
                            </button>

                          </div>

                        )
                      )
                    }

                  </div>

                </div>

              )
            }

          </div>

          {/* PATIENT PROFILE */}

          <div
            style={{
              ...styles.clinicalCardFrame,
              backgroundColor:
                currentTheme.cardBg,
              borderColor:
                currentTheme.cardBorder
            }}
          >

            <span
              style={
                styles.sectionTitleLabelText
              }
            >
              👨‍⚕️ Patient Profile
            </span>

            <div
              style={{
                display:'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap:'12px'
              }}
            >

              <input
                type="number"
                placeholder="Age"
                value={patientAge}
                onChange={(e)=>
                  setPatientAge(
                    e.target.value
                  )
                }
                style={{
                  ...styles.customTextInputControl,
                  backgroundColor:
                    currentTheme.inputBg,
                  borderColor:
                    currentTheme.inputBorder,
                  color:
                    currentTheme.text
                }}
              />

              <input
                type="text"
                placeholder="Medicine Allergy"
                value={allergy}
                onChange={(e)=>
                  setAllergy(
                    e.target.value
                  )
                }
                style={{
                  ...styles.customTextInputControl,
                  backgroundColor:
                    currentTheme.inputBg,
                  borderColor:
                    currentTheme.inputBorder,
                  color:
                    currentTheme.text
                }}
              />

            </div>
                        {/* HEALTH CONSTRAINTS */}

            <div
              style={{
                marginTop:'18px'
              }}
            >

              <div
                style={{
                  fontWeight:'700',
                  marginBottom:'10px'
                }}
              >
                🧩 CSP Constraints
              </div>

              <div
                style={{
                  display:'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap:'10px'
                }}
              >

                <label>

                  <input
                    type="checkbox"
                    checked={
                      kidneyDisease
                    }
                    onChange={(e)=>
                      setKidneyDisease(
                        e.target.checked
                      )
                    }
                  />

                  {' '}
                  Kidney Disease

                </label>

                <label>

                  <input
                    type="checkbox"
                    checked={
                      liverDisease
                    }
                    onChange={(e)=>
                      setLiverDisease(
                        e.target.checked
                      )
                    }
                  />

                  {' '}
                  Liver Disease

                </label>

                <label>

                  <input
                    type="checkbox"
                    checked={
                      pregnant
                    }
                    onChange={(e)=>
                      setPregnant(
                        e.target.checked
                      )
                    }
                  />

                  {' '}
                  Pregnancy

                </label>

                <label>

                  <input
                    type="checkbox"
                    checked={
                      diabetes
                    }
                    onChange={(e)=>
                      setDiabetes(
                        e.target.checked
                      )
                    }
                  />

                  {' '}
                  Diabetes

                </label>

              </div>

            </div>

          </div>

          {/* BMI CARD */}

          <div
            style={{
              ...styles.clinicalCardFrame,
              backgroundColor:
                currentTheme.cardBg,
              borderColor:
                currentTheme.cardBorder
            }}
          >

            <span
              style={
                styles.sectionTitleLabelText
              }
            >
              ⚖️ BMI Analytics
            </span>

            <div
              style={{
                display:'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap:'12px'
              }}
            >

              <input
                type="number"
                placeholder="Weight (kg)"
                value={weightKg}
                onChange={(e)=>
                  setWeightKg(
                    e.target.value
                  )
                }
                style={{
                  ...styles.customTextInputControl,
                  backgroundColor:
                    currentTheme.inputBg,
                  borderColor:
                    currentTheme.inputBorder,
                  color:
                    currentTheme.text
                }}
              />

              <input
                type="number"
                placeholder="Height (cm)"
                value={heightCm}
                onChange={(e)=>
                  setHeightCm(
                    e.target.value
                  )
                }
                style={{
                  ...styles.customTextInputControl,
                  backgroundColor:
                    currentTheme.inputBg,
                  borderColor:
                    currentTheme.inputBorder,
                  color:
                    currentTheme.text
                }}
              />

            </div>

            <button
              onClick={
                processBmiMetrics
              }
              style={{
                ...styles.primaryActionBtn,
                marginTop:'15px'
              }}
            >
              Calculate BMI
            </button>

            {
              calculatedBmi && (

                <div
                  style={{
                    marginTop:'18px',
                    padding:'14px',
                    borderRadius:'12px',
                    background:
                      '#0f172a',
                    color:'#10b981'
                  }}
                >

                  <div>

                    BMI :
                    {' '}
                    {
                      calculatedBmi
                    }

                  </div>

                  <div>

                    Category :
                    {' '}
                    {
                      bmiCategory
                    }

                  </div>

                </div>

              )
            }

          </div>

          {/* ANALYZE BUTTON */}

          <button
            onClick={
              calculateDifferentialDiagnosis
            }
            style={{
              ...styles.primaryActionBtn,
              width:'100%',
              height:'60px',
              fontSize:'17px',
              fontWeight:'700'
            }}
          >
            🧠 Run AI Diagnosis
          </button>

        </div>
                {/* RIGHT PANEL */}

        <div
          style={
            styles.rightAnalyticsPanel
          }
        >

          {/* DISEASE RESULTS */}

          {
            predictedDiseases.length >
            0 ? (

              predictedDiseases.map(
                (
                  disease,
                  index
                ) => {

                  const medicationAnalysis =
                    applyMedicationConstraints(
                      disease.medicines
                    );

                  return (

                    <div
                      key={index}
                      style={{
                        ...styles.clinicalCardFrame,
                        backgroundColor:
                          currentTheme.cardBg,
                        borderColor:
                          currentTheme.cardBorder
                      }}
                    >

                      <div
                        style={{
                          display:'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'center'
                        }}
                      >

                        <h3
                          style={{
                            margin:0
                          }}
                        >
                          🩺
                          {' '}
                          {
                            disease.name
                          }
                        </h3>

                        <span
                          style={{
                            color:'#10b981',
                            fontWeight:'700'
                          }}
                        >
                          {
                            disease.confidence
                          }
                          %
                        </span>

                      </div>

                      <p
                        style={{
                          color:
                            currentTheme.subText
                        }}
                      >
                        Category :
                        {' '}
                        {
                          disease.category
                        }
                      </p>

                      {/* SCREENINGS */}

                      <div
                        style={{
                          marginTop:'15px'
                        }}
                      >

                        <strong>
                          Recommended
                          Screenings
                        </strong>

                        <ul>

                          {
                            disease.screenings.map(
                              (
                                scan,
                                scanIndex
                              ) => (

                                <li
                                  key={
                                    scanIndex
                                  }
                                >
                                  {scan}
                                </li>

                              )
                            )
                          }

                        </ul>

                      </div>

                      {/* SAFE MEDICATIONS */}

                      <div
                        style={{
                          marginTop:'15px'
                        }}
                      >

                        <strong
                          style={{
                            color:'#10b981'
                          }}
                        >
                          ✅ Safe Medicines
                        </strong>

                        <ul>

                          {
                            medicationAnalysis.valid.map(
                              (
                                med,
                                medIndex
                              ) => (

                                <li
                                  key={
                                    medIndex
                                  }
                                >
                                  {med}
                                </li>

                              )
                            )
                          }

                        </ul>

                      </div>

                      {/* REJECTED MEDICATIONS */}

                      {
                        medicationAnalysis
                          .rejected
                          .length > 0 && (

                          <div
                            style={{
                              marginTop:'15px'
                            }}
                          >

                            <strong
                              style={{
                                color:'#ef4444'
                              }}
                            >
                              ❌ Blocked Medicines
                            </strong>

                            <ul>

                              {
                                medicationAnalysis
                                  .rejected
                                  .map(
                                    (
                                      item,
                                      idx
                                    ) => (

                                      <li
                                        key={
                                          idx
                                        }
                                      >

                                        {
                                          item.medicine
                                        }

                                        {' - '}

                                        {
                                          item.reason
                                        }

                                      </li>

                                    )
                                  )
                              }

                            </ul>

                          </div>

                        )
                      }

                      {/* CSP SCORE */}

                      <div
                        style={{
                          marginTop:'20px',
                          padding:'12px',
                          borderRadius:'12px',
                          background:
                            '#0f172a',
                          color:'#10b981'
                        }}
                      >

                        🧩 CSP Satisfaction
                        Score :

                        {' '}

                        {
                          medicationAnalysis
                            .score
                        }
                        %

                      </div>

                    </div>

                  );

                }
              )

            ) : (

              <div
                style={{
                  ...styles.clinicalCardFrame,
                  backgroundColor:
                    currentTheme.cardBg,
                  borderColor:
                    currentTheme.cardBorder
                }}
              >

                <h3>
                  🤖 Awaiting Analysis
                </h3>

                <p>
                  Select symptoms and
                  click
                  {' '}
                  <strong>
                    Run AI Diagnosis
                  </strong>
                  {' '}
                  to generate
                  clinical insights.
                </p>

              </div>

            )
          }

          {/* SYSTEM LOGS */}

          <div
            style={{
              ...styles.clinicalCardFrame,
              backgroundColor:
                currentTheme.cardBg,
              borderColor:
                currentTheme.cardBorder
            }}
          >

            <h3>
              📜 Activity Logs
            </h3>

            {
              consoleLogs.map(
                (
                  log,
                  index
                ) => (

                  <div
                    key={index}
                    style={{
                      padding:'10px',
                      marginBottom:'8px',
                      borderRadius:'8px',
                      background:
                        currentTheme.inputBg
                    }}
                  >
                    {log}
                  </div>

                )
              )
            }

          </div>

        </div>

      </div>

    </div>

  );
}
  const styles = {

  dashboardContainerLayoutFrame: {
    minHeight: '100vh',
    padding: '25px',
    transition: '0.3s ease'
  },

  topHeaderTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid',
    paddingBottom: '20px',
    marginBottom: '25px'
  },

  mainCoreTitleHeader: {
    fontSize: '32px',
    fontWeight: '800',
    margin: 0
  },

  subHeaderSubtitle: {
    marginTop: '8px',
    fontSize: '14px'
  },

  themeToggleBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  globalFlushBtn: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  workspaceSplitGridRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '20px'
  },

  leftMainWorkspacePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  rightAnalyticsPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  clinicalCardFrame: {
    border: '1px solid',
    borderRadius: '20px',
    padding: '20px',
    boxShadow:
      '0 10px 25px rgba(0,0,0,0.08)'
  },

  sectionTitleLabelText: {
    display: 'block',
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '18px'
  },

  interactiveGridMeshSystemBlocks: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(140px,1fr))',
    gap: '12px'
  },

  capsuleGridBlockUnitCell: {
    border: '2px solid',
    borderRadius: '14px',
    padding: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: '0.3s ease'
  },

  emojiDisplay: {
    display: 'block',
    fontSize: '30px',
    marginBottom: '10px'
  },

  symptomTextLabel: {
    fontSize: '13px',
    fontWeight: '600'
  },

  customTextInputControl: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid',
    fontSize: '14px',
    outline: 'none'
  },

  addTokenInlineBtn: {
    background: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 18px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  activeTokenPoolWrapper: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid',
    borderRadius: '12px'
  },

  poolHeaderTitle: {
    fontWeight: '700',
    marginBottom: '12px'
  },

  symptomBadgeToken: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#2563eb',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '13px'
  },

  tokenDismissCrossBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px'
  },

  primaryActionBtn: {
    background:
      'linear-gradient(135deg,#2563eb,#1d4ed8)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 18px',
    cursor: 'pointer',
    fontWeight: '700',
    boxShadow:
      '0 8px 20px rgba(37,99,235,0.25)'
  }

};
