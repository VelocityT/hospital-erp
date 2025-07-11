import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { medicineCategories, units } from "../../utils/localStorage";
import { createOrUpdateMedicineApi } from "../../services/apis";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const AddMedicine = ({ isEdit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Prefill form fields in edit mode
  React.useEffect(() => {
    if (isEdit && location.state) {
      const { name, category, unit, manufacturer, buyPrice, sellPrice } =
        location.state;
      form.setFieldsValue({
        name,
        category,
        unit,
        manufacturer,
        buyPrice,
        sellPrice,
      });
      // setFileList([{ uid: '-1', name: 'photo.jpg', status: 'done', url: location.state.photoUrl }]);
    }
  }, [isEdit, location.state, form]);

  const onFinish = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "photo") {
        formData.append(key, value);
      }
    });
    // Use id from useParams for edit
    if (isEdit && id) {
      formData.append("_id", id);
    }
    if (fileList.length > 0) {
      formData.append("medicinePhoto", fileList[0].originFileObj);
    }
    try {
      const res = await createOrUpdateMedicineApi(formData);
      toast.success(
        isEdit
          ? "Medicine updated successfully!"
          : "Medicine added successfully!"
      );
      form.resetFields();
      setFileList([]);
      navigate("/pharmacy");
    } catch (err) {
      toast.error(err?.message || "Failed to add medicine");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        {isEdit ? "Edit Medicine" : "Add New Medicine"}
      </h2>
      <Card bordered={false} className="shadow-md rounded-lg">
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          size="large"
          style={{ marginTop: 16 }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Medicine Name"
                rules={[
                  { required: true, message: "Please enter medicine name" },
                ]}
              >
                <Input placeholder="Enter medicine name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="Medicine Category"
                rules={[
                  {
                    required: true,
                    message: "Please enter or select category",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Type or select category code"
                  optionFilterProp="value"
                  filterOption={(input, option) =>
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  onSearch={() => {}}
                  notFoundContent={null}
                >
                  {medicineCategories.map((cat) => (
                    <Select.Option key={cat.code} value={cat.code}>
                      {cat.code}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="unit"
                label="Unit"
                rules={[
                  { required: true, message: "Please enter or select unit" },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Type or select unit code"
                  optionFilterProp="value"
                  filterOption={(input, option) =>
                    option?.value?.toLowerCase().includes(input.toLowerCase())
                  }
                  onSearch={() => {}}
                  notFoundContent={null}
                >
                  {units.map((unit) => (
                    <Select.Option key={unit.code} value={unit.code}>
                      {unit.code}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="manufacturer"
                label="Manufacturer"
                rules={[
                  { required: true, message: "Please enter manufacturer name" },
                ]}
              >
                <Input placeholder="Enter manufacturer name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="buyPrice"
                label="Buy Price"
                rules={[{ required: true, message: "Enter buy price" }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Buy price"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="sellPrice"
                label="Selling Price"
                rules={[{ required: true, message: "Enter selling price" }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Selling price"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="photo"
                label="Medicine Photo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="mb-0"
                extra="Upload a clear image of the medicine"
              >
                <Upload
                  name="photo"
                  listType="picture"
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={({ fileList: newFileList }) =>
                    setFileList(newFileList)
                  }
                  maxCount={1}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Select Photo</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" size="large">
              {isEdit ? "Update Medicine" : "Add Medicine"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddMedicine;
