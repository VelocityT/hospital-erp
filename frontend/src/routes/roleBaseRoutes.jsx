// Patient
import PatientRegistration from "../pages/Patient/PatientRegistrationPage";
import PatientList from "../pages/Patient/PatientList";
import PatientProfile from "../pages/Patient/PatientProfile";

// Staff
import StaffList from "../pages/staff/StaffList";
import StaffRegistrationForm from "../pages/staff/StaffRegistrationUpdateForm";
import StaffProfile from "../pages/staff/StaffProfile";

// Doctor
import DoctorList from "../pages/Doctor/DoctorList";
import Prescription from "../pages/prescription/Prescription";

// OPD/IPD
import OPDIPDList from "../pages/OPDIPD/OPDIPDList";
import AddOpdIpd from "../pages/OPDIPD/AddOpdIpd";
import IpdOpdDetails from "../pages/OPDIPD/IpdOpdDetails";

// IPD Details
import IPDdashboard from "../pages/IPD/IPDdashboard";
import AdmissionForm from "../pages/IPD/components/AdmissionForm";
import BedAssignment from "../pages/IPD/components/BedAssignment";

// Ward/Bed
import WardManagment from "../pages/wardManagment/WardManagment";
import BedsList from "../pages/wardManagment/BedsList";

// Pharmacy
import AddMedicine from "../pages/pharmacy/AddMedicine";
import MedicineList from "../pages/pharmacy/MedicineList";

// Billing
import PatientBilling from "../pages/billing/PatientBilling";

const commonRoutes = [
  { path: "/patients", element: <PatientList /> },
  { path: "/doctors", element: <DoctorList /> },
  { path: "/opd-list", element: <OPDIPDList type="opd" /> },
  { path: "/ipd-list", element: <OPDIPDList type="ipd" /> },
  { path: "/wards", element: <WardManagment /> },
  { path: "/wards/beds/:wardId", element: <BedsList /> },
  { path: "/patient/profile/:patientId", element: <PatientProfile /> },
];

export const roleRoutes = {
  admin: [
    ...commonRoutes,

    // Registration
    { path: "/registration", element: <PatientRegistration /> },
    {
      path: "/registration/edit/:patientId",
      element: <PatientRegistration edit="patient" />,
    },
    { path: "/ipd/edit/:ipdId", element: <PatientRegistration edit="ipd" /> },
    { path: "/opd/edit/:opdId", element: <PatientRegistration edit="opd" /> },

    // Staff
    { path: "/staff", element: <StaffList /> },
    { path: "/staff/registration", element: <StaffRegistrationForm /> },
    {
      path: "/staff/edit/:staffId",
      element: <StaffRegistrationForm edit={true} />,
    },
    { path: "/staff/profile/:staffId", element: <StaffProfile /> },

    // OPD/IPD
    { path: "/ipd/add/:patientId", element: <AddOpdIpd add="ipd" /> },
    { path: "/opd/add/:patientId", element: <AddOpdIpd add="opd" /> },
    { path: "/ipd/:ipdId", element: <IpdOpdDetails /> },
    { path: "/opd/:opdId", element: <IpdOpdDetails /> },

    //pharmacist
    { path: "/pharmacy/medicine/add", element: <AddMedicine /> },
    {
      path: "/pharmacy/medicine/edit/:id",
      element: <AddMedicine isEdit={true} />,
    },
    { path: "/pharmacy", element: <MedicineList /> },

    //Doctor
    { path: "/addPrescription", element: <Prescription /> },

    //billing
    { path: "/billing/patientBilling", element: <PatientBilling /> },
  ],

  doctor: [
    ...commonRoutes,
    { path: "/registration", element: <PatientRegistration /> },
    {
      path: "/registration/edit/:patientId",
      element: <PatientRegistration edit="patient" />,
    },
    { path: "/ipd/edit/:ipdId", element: <PatientRegistration edit="ipd" /> },
    { path: "/opd/edit/:opdId", element: <PatientRegistration edit="opd" /> },
    { path: "/ipd/add/:patientId", element: <AddOpdIpd add="ipd" /> },
    { path: "/opd/add/:patientId", element: <AddOpdIpd add="opd" /> },
    { path: "/ipd/:ipdId", element: <IpdOpdDetails /> },
    { path: "/opd/:opdId", element: <IpdOpdDetails /> },
    { path: "/addPrescription", element: <Prescription /> },
  ],

  nurse: [
    ...commonRoutes,
    { path: "/ipd/:ipdId", element: <IpdOpdDetails /> },
    { path: "/opd/:opdId", element: <IpdOpdDetails /> },
  ],

  pharmacist: [
    ...commonRoutes,
    { path: "/pharmacy/medicine/add", element: <AddMedicine /> },
    {
      path: "/pharmacy/medicine/edit/:id",
      element: <AddMedicine isEdit={true} />,
    },
    { path: "/pharmacy", element: <MedicineList /> },
  ],

  receptionist: [
    ...commonRoutes,
    { path: "/registration", element: <PatientRegistration /> },
    {
      path: "/registration/edit/:patientId",
      element: <PatientRegistration edit="patient" />,
    },
    { path: "/ipd/edit/:ipdId", element: <PatientRegistration edit="ipd" /> },
    { path: "/opd/edit/:opdId", element: <PatientRegistration edit="opd" /> },
    { path: "/ipd/add/:patientId", element: <AddOpdIpd add="ipd" /> },
    { path: "/opd/add/:patientId", element: <AddOpdIpd add="opd" /> },
    { path: "/billing/patientBilling", element: <PatientBilling /> },
  ],

  default: [],
};
