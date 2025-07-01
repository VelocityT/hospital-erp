export const medicineCategoriesDummy = [
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
  website: "https://www.velocarehospital.com",
};

export const units = [
  { code: "PCS", description: "Pieces" },
  { code: "SYP", description: "Syrup" },
  { code: "TAB", description: "Tablet" },
  { code: "CAP", description: "Capsule" },
  { code: "INJ", description: "Injection" },
  { code: "GEL", description: "Gel (Topical or Oral)" },
  { code: "POWD", description: "Powder" },
  { code: "WASH", description: "Wash (e.g., Antiseptic Wash)" },
  { code: "OINT", description: "Ointment" },
  { code: "DROP", description: "Drops (e.g., Eye/Ear/Nasal Drops)" },
  { code: "RESP", description: "Respule (Liquid medication for nebulizers)" },
  { code: "SYP/P", description: "Syrup (Pediatric)" },
  { code: "TAB/P", description: "Tablet (Pediatric)" },
  { code: "ML", description: "Milliliters (Liquid measurement)" },
  { code: "STRP", description: "Strip (Pack of tablets/capsules)" },
  { code: "PWOD", description: "Powder (alternate spelling)" },
  { code: "WIPT", description: "Wipes" },
  { code: "SUSP", description: "Suspension (Liquid form of medicine)" },
  { code: "CRE", description: "Cream" },
  { code: "GARG", description: "Gargle (Mouthwash or Throat Gargle)" },
  { code: "TABS", description: "Tablets (Plural of TAB)" },
  { code: "SOL", description: "Solution" },
  { code: "TUBE", description: "Tube (e.g., Ointments or Gels)" },
  { code: "ADLT", description: "Adult (Medicine intended for adults)" },
  { code: "LIQ", description: "Liquid" },
  { code: "CREM", description: "Cream (alternate spelling)" },
  {
    code: "MILK",
    description: "Medicinal milk preparation (e.g., magnesium milk)",
  },
  { code: "F/W", description: "Face Wash" },
  { code: "LIQU", description: "Liquid (alternate spelling)" },
  { code: "PSTE", description: "Paste (e.g., Toothpaste, Medicinal Paste)" },
  { code: "JAR", description: "Jar (Container)" },
  { code: "BOTT", description: "Bottle" },
  { code: "OIL", description: "Oil (e.g., Medicinal Oil)" },
  { code: "DIPE", description: "Diapers" },
  { code: "H/W", description: "Hand Wash" },
  { code: "SOAP", description: "Soap (Medicinal or Antiseptic Soap)" },
  { code: "POW", description: "Powder (alternate spelling)" },
  { code: "PSC", description: "Piece" },
  { code: "NED", description: "Nebulizer Solution" },
  { code: "REPS", description: "Respules (alternate spelling)" },
  { code: "SPRY", description: "Spray" },
  { code: "AMP", description: "Ampoule (Sealed vial for injection)" },
  { code: "OITT", description: "Ointment (alternate spelling)" },
  { code: "POWE", description: "Powder (alternate spelling)" },
  { code: "WATR", description: "Water (e.g., Sterile Water for Injection)" },
  { code: "WATE", description: "Water (alternate spelling)" },
  { code: "WIP", description: "Wipes (alternate spelling)" },
  { code: "PIC", description: "Picture or Pack (context-dependent)" },
  { code: "KIT", description: "Kit (e.g., Medical or Testing Kit)" },
  { code: "LOSE", description: "Loose (Unpacked or unpackaged form)" },
  { code: "SOLU", description: "Solution (alternate spelling)" },
  { code: "PADS", description: "Pads (e.g., Medicinal Pads, Bandages)" },
  { code: "SOLT", description: "Solution (alternate spelling)" },
  { code: "LIQD", description: "Liquid (alternate spelling)" },
  { code: "GM", description: "Gram" },
  { code: "PANT", description: "Pant (e.g., Diaper Pants)" },
  { code: "PANY", description: "Panty (e.g., Protective Underwear)" },
  { code: "WIPS", description: "Wipes (alternate spelling)" },
  { code: "PUMP", description: "Pump (e.g., Spray or Liquid Dispenser)" },
  { code: "SRYA", description: "Syringe (alternate spelling)" },
  { code: "VAIL", description: "Vial (alternate spelling)" },
  { code: "INJT", description: "Injection (alternate spelling)" },
  { code: "SUS", description: "Suspension (alternate spelling)" },
  { code: "SPRA", description: "Spray (alternate spelling)" },
  { code: "PWD", description: "Powder (alternate spelling)" },
  { code: "METR", description: "Metered Dose (e.g., Inhaler or Spray)" },
  { code: "PCSA", description: "Pieces (alternate spelling)" },
  { code: "BELT", description: "Belt (e.g., Hernia or Support Belt)" },
  { code: "OITS", description: "Ointment (alternate spelling)" },
  { code: "BOTL", description: "Bottle (alternate spelling)" },
  { code: "PAST", description: "Paste (alternate spelling)" },
  { code: "PAD", description: "Pad (alternate spelling)" },
  { code: "SOFY", description: "Sofy (specific brand of sanitary pads)" },
  { code: "E/D", description: "Eye Drops" },
  { code: "E/O", description: "Ear Drops" },
  { code: "E/W", description: "Eye Wash" },
  { code: "M/O", description: "Mouthwash" },
  { code: "M/P", description: "Medicinal Powder" },
  { code: "M/G", description: "Medicinal Gel" },
];

export const medicineCategories=[
  { "code": "SYRUP", "description": "Syrup" },
  { "code": "TABLET", "description": "Tablet" },
  { "code": "CAPSULE", "description": "Capsule" },
  { "code": "INJECTION", "description": "Injection" },
  { "code": "OINTMENT", "description": "Ointment" },
  { "code": "CREAM", "description": "Cream" },
  { "code": "LOTION", "description": "Lotion" },
  { "code": "GEL", "description": "Gel" },
  { "code": "DROPS", "description": "Drops (Eye/Ear/Nasal)" },
  { "code": "SPRAY", "description": "Spray" },
  { "code": "SUSPENSION", "description": "Suspension" },
  { "code": "POWDER", "description": "Powder" },
  { "code": "RESPULE", "description": "Respule" },
  { "code": "SOAP", "description": "Medicinal Soap" },
  { "code": "PASTE", "description": "Medicinal Paste" },
  { "code": "MOUTHWASH", "description": "Mouthwash / Gargle" },
  { "code": "DROPPER", "description": "Dropper Bottle" },
  { "code": "NEBULIZER", "description": "Nebulizer Solution" },
  { "code": "LIQUID", "description": "Liquid Medication" },
  { "code": "INHALER", "description": "Inhaler" },
  { "code": "PATCH", "description": "Transdermal Patch" },
  { "code": "SUPPOSITORY", "description": "Suppository" },
  { "code": "SYRINGE", "description": "Pre-filled Syringe" },
  { "code": "KIT", "description": "Medical Kit" }
]
