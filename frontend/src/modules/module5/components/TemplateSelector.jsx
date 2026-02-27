import React from "react";
import { useResume } from "../context/ResumeContext";

const TemplateSelector = () => {
  const { selectedTemplate, setSelectedTemplate } = useResume();

  const templates = [
    { key: "azurill", label: "Azurill" },
    { key: "minimal", label: "Minimal Line" },
    { key: "blue", label: "Corporate Blue" },
    { key: "split", label: "Split Two Column" },
    { key: "accent", label: "Accent" },
    { key: "chikorita", label: "Chikorita" },
    { key: "leafish", label: "Leafish" },
    { key: "modern", label: "Modern Accent" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Templates</h2>

      {templates.map((template) => (
        <div
          key={template.key}
          onClick={() => setSelectedTemplate(template.key)}
          style={{
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "0.2s ease",
            backgroundColor:
              selectedTemplate === template.key ? "#eef2ff" : "#f9fafb",
            border:
              selectedTemplate === template.key
                ? "2px solid #6366f1"
                : "1px solid #e5e7eb",
          }}
        >
          {template.label}
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;
