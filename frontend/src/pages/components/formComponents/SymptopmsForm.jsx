import { useEffect } from "react";
import { Card, Row, Col, Form, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { symptomsData } from "../../../utils/localStorage";

const SymptomsForm = ({
  form,
  selectedSymptoms,
  setSelectedSymptoms,
  symptomsTitles,
  setSymptomsTitles,
  symptomsDescription,
  setSymptomsDescription,
}) => {
  useEffect(() => {
    // Defensive: symptomsData may not be loaded
    if (!Array.isArray(symptomsData)) return;
    const allTitles = symptomsData
      .filter((data) => selectedSymptoms.includes(data.symptom))
      .flatMap((data) => data.titles.map((t) => t.title));
    setSymptomsTitles(allTitles);
  }, [selectedSymptoms, setSymptomsTitles]);

  useEffect(() => {
    if (!Array.isArray(symptomsData)) return;
    if (selectedSymptoms.length === 0) {
      setSymptomsDescription("");
      return;
    }
    const selectedTitles = form.getFieldValue("symptomsTitles") || [];
    let descriptions = [];
    for (const symptom of selectedSymptoms) {
      const data = symptomsData.find((s) => s.symptom === symptom);
      if (data) {
        for (const title of selectedTitles) {
          const found = data.titles.find((t) => t.title === title);
          if (found) {
            descriptions.push(`${title}: ${found.description}`);
          }
        }
      }
    }
    setSymptomsDescription(descriptions.join("\n"));
  }, [selectedSymptoms, symptomsTitles, form, setSymptomsDescription]);

  const handleSymptomsTitlesChange = (titles) => {
    form.setFieldsValue({ symptomsTitles: titles });
    if (!Array.isArray(symptomsData)) return;
    let descriptions = [];
    for (const symptom of selectedSymptoms) {
      const data = symptomsData.find((s) => s.symptom === symptom);
      if (data) {
        for (const title of titles) {
          const found = data.titles.find((t) => t.title === title);
          if (found) {
            descriptions.push(`${title}: ${found.description}`);
          }
        }
      }
    }
    setSymptomsDescription(descriptions.join("\n"));
  };

  const handleSymptomsDescriptionChange = (e) => {
    setSymptomsDescription(e.target.value);
  };

  return (
    <Card title="Symptoms Details" bordered={false}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Select Symptoms"
            name="symptoms"
            rules={[
              {
                required: true,
                message: "Please select at least one symptom",
              },
            ]}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="Select Symptoms"
              onChange={setSelectedSymptoms}
              options={
                Array.isArray(symptomsData)
                  ? symptomsData.map((s) => ({
                      label: s.symptom,
                      value: s.symptom,
                    }))
                  : []
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Select Symptom Titles"
            name="symptomsTitles"
            rules={[
              {
                required: true,
                message: "Please select at least one title",
              },
            ]}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="Select Symptoms"
              options={symptomsTitles.map((t) => ({
                label: t,
                value: t,
              }))}
              onChange={handleSymptomsTitlesChange}
            />
          </Form.Item>
        </Col>
      </Row>
      <Col sx={24}>
        <Form.Item label="Symptoms Description">
          <TextArea
            value={symptomsDescription}
            autoSize={{ minRows: 3 }}
            onChange={handleSymptomsDescriptionChange}
            placeholder="Add Description"
          />
        </Form.Item>
      </Col>
    </Card>
  );
};

export default SymptomsForm;
