import { Card, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStaticData } from "../../services/apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaCapsules,
  FaMoneyBillWave,
  FaProcedures,
  FaStethoscope,
  FaUserCheck,
  FaUserMd,
  FaUserNurse,
  FaUserPlus,
  FaUserTie,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newPatients, setNewPatients] = useState({});
  const [staffs, setStaffs] = useState({});
  const [incomeToday, setIncomeToday] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState({});

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      const res = await getDashboardStaticData();
      if (res.success) {
        setNewPatients(res?.data?.newPatients);
        setStaffs(res?.data?.staffs);
        setIncomeToday(
          Object.entries(res?.data?.income?.today || {}).map(
            ([name, value]) => {
              const colorMap = {
                Ipd: "#3b82f6",
                Opd: "#22c55e",
                Pharmacy: "#a855f7",
                Pathology: "#f43f5e",
              };
              return { name, value, color: colorMap[name] };
            }
          )
        );
        setIncomeTotal(res?.data?.income?.total);
      } else {
        toast.error(res.message || "Failed to fetch dashboard stats");
      }
      setLoading(false);
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex gap-2 items-center">
            <FaMoneyBillWave /> Income Overview
          </h2>
          <Row gutter={[12, 12]} className="mb-6">
            {Object.entries(incomeTotal).map(([key, value], i) => {
              return (
                <Col xs={24} sm={12} md={12} lg={6} key={i}>
                  <Card
                    bodyStyle={{ padding: 12 }}
                    onClick={() =>
                      navigate("/admin/income/" + key.toLowerCase())
                    }
                    className="hover:shadow-lg hover:shadow-green-500/40 transition duration-300 ease-in-out cursor-pointer overflow-hidden"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {key} Income
                    </p>
                    <p className="text-base font-semibold text-green-500 mb-1">
                      ₹{value}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">
                      Today: ₹{incomeToday[i]?.value || 0}
                    </p>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FaUserPlus />
            New Patients
          </h2>
          <Row gutter={[12, 12]}>
            {[
              {
                title: "New IPD",
                count: newPatients?.ipdsToday,
                total: newPatients?.ipdsTotal,
                active: newPatients?.ipdsActive,
                navigateTo: "/ipd-list",
                icon: <FaProcedures />,
              },
              {
                title: "New OPD",
                count: newPatients?.opdsToday,
                total: newPatients?.opdsTotal,
                navigateTo: "/opd-list",
                icon: <FaUserCheck />,
              },
              {
                title: "New Patients",
                count: newPatients?.patientsToday,
                total: newPatients?.patientsTotal,
                navigateTo: "/patients",
                icon: <FaUserPlus />,
              },
            ].map((item, i) => (
              <Col xs={24} sm={12} md={8} key={i}>
                <Card
                  bodyStyle={{ padding: 12 }}
                  className="relative overflow-hidden hover:shadow-lg hover:shadow-blue-500/40 transition duration-300 ease-in-out cursor-pointer"
                  onClick={() => navigate(item.navigateTo)}
                >
                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                    {item.title}
                  </p>
                  <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    {item.count}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 mb-1">
                    Total: {item.total}
                  </p>
                  <div className="min-h-[20px]">
                    {item.active !== undefined ? (
                      <p className="text-green-500 dark:text-green-400 font-medium text-sm mb-0">
                        Admitted: {item.active}
                      </p>
                    ) : null}
                  </div>

                  <div className="absolute right-2 bottom-2 text-blue-600 opacity-70 text-[60px] pointer-events-none z-0 max-[275px]:hidden">
                    {item.icon}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Today’s Income
          </h2>
          <div className="p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] h-[300px] sm:h-[350px] md:h-[285px] lg:h-[calc(100%-40px)]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeToday}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {incomeToday.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mt-10 mb-4 flex items-center gap-2">
        <FaStethoscope />
        Staff Overview
      </h2>
      <Row gutter={[12, 12]}>
        {[
          {
            label: "Doctors",
            role: "doctor",
            value: staffs?.doctors,
            icon: <FaUserMd />,
          },
          {
            label: "Receptionists",
            role: "receptionist",
            value: staffs?.receptionists,
            icon: <FaUserTie />,
          },
          {
            label: "Pharmacists",
            role: "pharmacist",
            value: staffs?.pharmacists,
            icon: <FaCapsules />,
          },
          {
            label: "Nurses",
            role: "nurse",
            value: staffs?.nurses,
            icon: <FaUserNurse />,
          },
        ].map((staff, i) => (
          <Col xs={24} sm={12} md={12} lg={6} key={i}>
            <Card
              bodyStyle={{ padding: 12 }}
              className="relative overflow-hidden hover:shadow-lg hover:shadow-indigo-500/40 transition duration-300 ease-in-out cursor-pointer bg-white dark:bg-neutral-900"
              onClick={() =>
                navigate("/staff", { state: { role: staff.role } })
              }
            >
              {/* Big faded icon */}
              <div className="absolute right-2 bottom-2 text-indigo-600 text-[60px] pointer-events-none opacity-70 z-0">
                {staff.icon}
              </div>

              {/* Actual content */}
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                {staff.label}
              </p>
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                {staff.value}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboard;
