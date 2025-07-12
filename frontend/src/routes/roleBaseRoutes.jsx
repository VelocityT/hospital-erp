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
import AdminDashboard from "../pages/admin/AdminDashboard";
import IncomeOverview from "../pages/admin/IncomeOverview";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import Hospitals from "../pages/superAdmin/Hospitals";
import CreateOrUpdateHospital from "../pages/superAdmin/CreateOrUpdateHospital";
import Hospital from "../pages/Hospital";

const commonRoutes = [
  { path: "/patients", element: <PatientList /> },
  { path: "/doctors", element: <DoctorList /> },
  { path: "/opd-list", element: <OPDIPDList type="opd" /> },
  { path: "/ipd-list", element: <OPDIPDList type="ipd" /> },
  { path: "/wards", element: <WardManagment /> },
  { path: "/wards/beds/:wardId", element: <BedsList /> },
  { path: "/patient/profile/:patientId", element: <PatientProfile /> },
];

const adminRoutes = [
  ...commonRoutes,
  { path: "/dashboard", element: <AdminDashboard /> },
  {
    path: "/admin/income/ipd",
    element: <IncomeOverview incomeSource="Ipd" />,
  },
  {
    path: "/admin/income/opd",
    element: <IncomeOverview incomeSource="Opd" />,
  },
  {
    path: "/admin/income/pharmacy",
    element: <IncomeOverview incomeSource="Pharmacy" />,
  },
  {
    path: "/admin/income/Pathology",
    element: <IncomeOverview incomeSource="Pathology" />,
  },
  { path: "/registration", element: <PatientRegistration /> },
  {
    path: "/registration/edit/:patientId",
    element: <PatientRegistration edit="patient" />,
  },
  { path: "/ipd/edit/:ipdId", element: <PatientRegistration edit="ipd" /> },
  { path: "/opd/edit/:opdId", element: <PatientRegistration edit="opd" /> },
  { path: "/staff", element: <StaffList /> },
  { path: "/staff/registration", element: <StaffRegistrationForm /> },
  {
    path: "/staff/edit/:staffId",
    element: <StaffRegistrationForm edit={true} />,
  },
  { path: "/staff/profile/:staffId", element: <StaffProfile /> },
  { path: "/ipd/add/:patientId", element: <AddOpdIpd add="ipd" /> },
  { path: "/opd/add/:patientId", element: <AddOpdIpd add="opd" /> },
  { path: "/ipd/:ipdId", element: <IpdOpdDetails /> },
  { path: "/opd/:opdId", element: <IpdOpdDetails /> },
  { path: "/pharmacy/medicine/add", element: <AddMedicine /> },
  {
    path: "/pharmacy/medicine/edit/:id",
    element: <AddMedicine isEdit={true} />,
  },
  { path: "/pharmacy", element: <MedicineList /> },
  { path: "/addPrescription", element: <Prescription /> },
  { path: "/billing/patientBilling", element: <PatientBilling /> },
];
export const roleRoutes = {
  admin: adminRoutes,

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

  superAdmin: [
    { path: "/dashboard", element: <SuperAdminDashboard /> },
    ...adminRoutes,
    { path: "/hospitals", element: <Hospitals /> },
    { path: "/hospitals/add", element: <CreateOrUpdateHospital /> },
    {
      path: "/hospitals/edit/:hospitalId",
      element: <CreateOrUpdateHospital edit={true} />,
    },
    { path: "/hospital/:id", element: <Hospital /> },
  ],

  default: [],
};
