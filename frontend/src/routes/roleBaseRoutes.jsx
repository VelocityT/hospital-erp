import OPDDashboard from "../pages/OPD/OPDdashboard";
import PatientRegistration from "../pages/Patient/PatientRegistrationPage";
import StaffRegistrationForm from "../pages/staff/StaffRegistrationForm";
import StaffList from "../pages/staff/StaffList";
import Prescription from "../pages/prescription/Prescription";
import DoctorList from "../pages/Doctor/DoctorList";
import AddDoctor from "../pages/Doctor/AddDoctor";
import PatientList from "../pages/Patient/PatientList";
import PatientProfile from "../pages/Patient/PatientProfile";
import OPDIPDList from "../pages/OPDIPD/OPDIPDList";
import IPDdashboard from "../pages/IPD/IPDdashboard";
import AdmissionForm from "../pages/IPD/components/AdmissionForm";
import BedAssignment from "../pages/IPD/components/BedAssignment";
import WardManagment from "../pages/wardManagment/WardManagment";
import BedsList from "../pages/wardManagment/BedsList";
import AddMedicine from "../pages/pharmacy/AddMedicine";
import MedicineList from "../pages/pharmacy/MedicineList";

const commonRoutes = [
  { path: "/patients", element: <PatientList /> },
  { path: "/doctors", element: <DoctorList /> },
  { path: "/opd-list", element: <OPDIPDList type="opd" /> },
  { path: "/ipd-list", element: <OPDIPDList type="ipd" /> },
  { path: "wards/beds/:wardId", element: <BedsList /> },
  { path: "/wards", element: <WardManagment /> },
  {
    path: "/registration/edit/:patientId",
    element: <PatientRegistration edit="patient" />,
  },
  { path: "/ipd/edit/:ipdId", element: <PatientRegistration edit="ipd" /> },
  { path: "/opd/edit/:opdId", element: <PatientRegistration edit="opd" /> },
  { path: "/addPrescription", element: <Prescription /> },
  { path: "/pharmacy/medicine/add", element: <AddMedicine /> },
  { path: "/pharmacy/medicine/edit/:id", element: <AddMedicine isEdit={true} /> },
  { path: "/pharmacy", element: <MedicineList /> },
];

export const roleRoutes = {
  admin: [
    ...commonRoutes,
    { path: "/registration", element: <PatientRegistration /> },
    { path: "/staff", element: <StaffList /> },
    { path: "/staff/registration", element: <StaffRegistrationForm /> },
    { path: "/doctor-registration", element: <AddDoctor /> },
  ],

  doctor: [
    ...commonRoutes,
    { path: "/registration", element: <PatientRegistration /> },
    { path: "/addPrescription", element: <Prescription /> },
  ],

  nurse: [...commonRoutes],

  pharmacist: [...commonRoutes],

  receptionist: [
    ...commonRoutes,
    { path: "/registration", element: <PatientRegistration /> },
  ],

  default: [],
};
