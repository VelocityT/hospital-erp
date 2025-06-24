import { Form, Select, Tag } from "antd";
import { useState } from "react";

const { Option } = Select;

const allergies = [
  "Penicillin",
  "Latex",
  "Pollen",
  "Dust Mites",
  "Peanuts",
  "Shellfish",
  "Eggs",
  "Soy",
  "Wheat",
  "Dairy",
];

function MedicalHistorySection({ form }) {
  const [selectedAllergies, setAllergies] = useState([]);

  return (
    <Form.Item label="Known Allergies">
      <Select
        mode="multiple"
        placeholder="Select allergies"
        value={selectedAllergies}
        onChange={setAllergies}
        style={{ width: "100%" }}
      >
        {allergies.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
      <div className="mt-2">
        {selectedAllergies.map((allergy) => (
          <Tag key={allergy} color="red" className="me-2 mb-2">
            {allergy}
          </Tag>
        ))}
      </div>
      <Form.Item name="allergies" hidden>
        <Input type="hidden" value={JSON.stringify(selectedAllergies)} />
      </Form.Item>
    </Form.Item>
  );
}

export default MedicalHistorySection;
