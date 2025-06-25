import React, { useEffect, useState } from "react";
import { getAllStaffApi } from "../../services/apis";
import { Row, Col, Input, Tag, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";

// const { Search } = Input;

const dummyImg =
  "https://static.vecteezy.com/system/resources/previews/023/876/301/non_2x/smiling-anime-boy-logo-vector.jpg"; // Placeholder image

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const getStaffList = async () => {
      setLoading(true);
      const response = await getAllStaffApi();
      const data = response?.data || [];
      setStaffs(data);
      setFilteredStaffs(data);
      setLoading(false);
    };
    getStaffList();
  }, []);

  // Search by staffId or fullName
  const onSearch = (value) => {
    setSearchText(value);
    const lower = value?.toLowerCase?.() || "";
    if (!lower) {
      setFilteredStaffs(staffs);
      return;
    }
    setFilteredStaffs(
      staffs.filter(
        (s) =>
          (s.staffId && s.staffId.toLowerCase().includes(lower)) ||
          (s.fullName && s.fullName.toLowerCase().includes(lower))
      )
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          onClick={()=>navigate("/staff/registration")} // Add handler if needed
          type="button"
        >
          + Add New Staff
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="font-bold text-lg m-0">Staff Management</h2>
        <Input.Search
          allowClear
          placeholder="Search by Staff ID or Name"
          onSearch={onSearch}
          onChange={(e) => onSearch(e.target.value)}
          className="mb-4 md:mb-2"
          value={searchText}
          style={{ maxWidth: 350 }}
        />
      </div>
      {loading ? (
        <Spin />
      ) : filteredStaffs.length === 0 ? (
        <Empty description="No staff found" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredStaffs.map((staff) => (
            <Col
              key={staff.staffId}
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={6}
              xxl={4}
            >
              <div className="flex flex-wrap items-center bg-white rounded-xl shadow hover:shadow-md transition-all duration-200 p-4 w-full max-w-xl mx-auto">
                <img
                  alt={staff.fullName}
                  src={dummyImg}
                  className="w-16 h-16 rounded-full object-cover mr-5 flex-shrink-0 border"
                />
                <div className="flex-1 min-w-[140px]">
                  <div className="font-semibold text-base mb-1">
                    {staff.fullName}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    ID: {staff.staffId}
                  </div>
                  <div className="mb-1">
                    <div className="mb-1">
                      <Tag color="blue">{staff.role}</Tag>
                    </div>
                    <div>
                      <Tag color="green">{staff.department}</Tag>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Gender: {staff.gender}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default StaffList;
