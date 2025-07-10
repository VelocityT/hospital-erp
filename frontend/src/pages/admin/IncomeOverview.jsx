import { useEffect, useState } from "react";
import { Table, Input, Row, Col, DatePicker, Select, Spin, Card } from "antd";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { getIncomeOverviewApi } from "../../services/apis";
import { useNavigate } from "react-router-dom";

const IncomeOverview = ({ incomeSource }) => {
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [filterMode, setFilterMode] = useState("date");

  useEffect(() => {
    const fetchIncomeOverview = async () => {
      try {
        setLoading(true);
        const response = await getIncomeOverviewApi({
          incomeSource,
          filterMode,
          selectedDate: selectedDate.format("YYYY-MM-DD"),
        });

        if (response?.success) {
          setData(response.data || []);
        } else {
          toast.error(response?.message || "Failed to load data");
        }
      } catch (error) {
        toast.error(error?.message || "Failed to fetch income overview");
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeOverview();
  }, [incomeSource, selectedDate, filterMode]);

  const filteredData = data.filter(
    (p) =>
      !searchText ||
      p.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Patient ID", dataIndex: "patientId", key: "patientId",render: (text) => (
        <span onClick={()=>navigate(`/patient/profile/${text}`)} className="text-blue-400 hover:text-blue-500 cursor-pointer">{text}</span>
      ), },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Total Charge", dataIndex: "totalCharge", key: "totalCharge" },
    { title: "Discount", dataIndex: "discount", key: "discount" },
    { title: "Tax", dataIndex: "tax", key: "tax" },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (text) => (
        <span className="text-green-600 font-semibold">{text}</span>
      ),
    },
  ];

  return (
    <Card
      title={
        <Row gutter={[12, 12]} align="middle" className="py-2">
          <Col flex="auto">
            <span className="font-semibold text-lg">
              {incomeSource} Income Overview
            </span>
          </Col>
          <Col>
            <Select
              value={filterMode}
              onChange={(val) => setFilterMode(val)}
              options={[
                { label: "Date", value: "date" },
                { label: "All", value: "all" },
              ]}
              className="min-w-[90px]"
            />
          </Col>
          {filterMode === "date" && (
            <Col>
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                allowClear={false}
                format="DD/MM/YYYY"
              />
            </Col>
          )}
          <Col>
            <Input.Search
              allowClear
              placeholder="Search by name or ID"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          </Col>
        </Row>
      }
      bordered={false}
    >
      {loading ? (
        <div className="flex justify-center p-8">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData.map((p, i) => ({ ...p, key: i }))}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      )}
    </Card>
  );
};

export default IncomeOverview;
