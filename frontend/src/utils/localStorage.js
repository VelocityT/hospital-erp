export const medicineCategories = [
  {
    category: "Syrup",
    medicines: [
      { name: "Paracetamol Syrup", unit: "5 ml" },
      { name: "Cough Syrup", unit: "10 ml" },
    ],
  },
  {
    category: "Capsule",
    medicines: [
      { name: "Amoxicillin", unit: "1 ct" },
      { name: "Vitamin D", unit: "1 ct" },
    ],
  },
  {
    category: "Injection",
    medicines: [
      { name: "Insulin", unit: "1 dose" },
      { name: "Tetanus Toxoid", unit: "0.5 ml" },
    ],
  },
  {
    category: "Liquid",
    medicines: [
      { name: "ORS Solution", unit: "100 ml" },
      { name: "Magnesium Hydroxide", unit: "10 ml" },
    ],
  },
  {
    category: "Diaper",
    medicines: [
      { name: "Adult Diaper", unit: "1 pc" },
      { name: "Baby Diaper", unit: "1 pc" },
    ],
  },
];

export const doseIntervals = [
  { label: "Once a day", value: "1_day" },
  { label: "Twice a day", value: "2_day" },
  { label: "Every 6 hours", value: "6_hour" },
  { label: "Every 8 hours", value: "8_hour" },
  { label: "Before meal", value: "before_meal" },
  { label: "After meal", value: "after_meal" },
];

export const doseDurations = [
  { label: "3 days", value: "3d" },
  { label: "5 days", value: "5d" },
  { label: "1 week", value: "7d" },
  { label: "10 days", value: "10d" },
  { label: "Until symptoms stop", value: "symptom_based" },
];

export const pathologyTests = [
  { name: "Complete Blood Count (CBC)", code: "CBC" },
  { name: "Blood Sugar (Fasting)", code: "BSF" },
  { name: "Blood Sugar (Postprandial)", code: "BSPP" },
  { name: "Liver Function Test (LFT)", code: "LFT" },
  { name: "Kidney Function Test (KFT)", code: "KFT" },
  { name: "Thyroid Profile (T3 T4 TSH)", code: "THYROID" },
  { name: "Urine Routine", code: "UR" },
  { name: "Hemoglobin (Hb)", code: "HB" },
];
export const radiologyTests = [
  { name: "X-Ray Chest PA View", code: "XRAY_CHEST_PA" },
  { name: "X-Ray Left Arm", code: "XRAY_LEFT_ARM" },
  { name: "Ultrasound Abdomen", code: "US_ABDOMEN" },
  { name: "CT Scan Brain", code: "CT_BRAIN" },
  { name: "MRI Spine", code: "MRI_SPINE" },
  { name: "Mammography", code: "MAMMO" },
  { name: "ECG", code: "ECG" },
];

export const bedTypes = [
  { label: "General", value: "general" },
  { label: "Semi-Private", value: "semi-private" },
  { label: "Private", value: "private" },
];

export const beds = [
  { label: "Bed 101", value: "bed101" },
  { label: "Bed 102", value: "bed102" },
  { label: "Bed 201", value: "bed201" },
];

export const symptomsData = [
  {
    symptom: "Fever",
    titles: [
      { title: "Low", description: "Low grade fever below 100°F." },
      { title: "High", description: "High fever above 102°F." },
    ],
  },
  {
    symptom: "Cough",
    titles: [
      { title: "Dry", description: "Dry cough without mucus." },
      { title: "Wet", description: "Cough with mucus and congestion." },
    ],
  },
  {
    symptom: "Headache",
    titles: [
      { title: "Mild", description: "Mild pain." },
      { title: "Severe", description: "Severe pulsing pain." },
    ],
  },
];
export const hospitalInfo = {
  name: "Velocare Multispeciality Hospital",
  logo: "https://thumbs.dreamstime.com/b/eagle-head-simple-logo-design-template-359138889.jpg",
  address: "123 Health Avenue, Sector 21, New Delhi, India - 110011",
  phone: "+91-9876543210",
  email: "contact@velocarehospital.com",
  website: "https://www.velocarehospital.com"
};
