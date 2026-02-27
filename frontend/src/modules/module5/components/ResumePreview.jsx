import { useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";
import "./ResumePreview.css";

const ResumePreview = () => {
  const { resumeData, selectedTemplate } =
    useContext(ResumeContext);

  return (
    <div
      className="preview-container"
      style={{
        fontFamily: selectedTemplate.styles.fontFamily
      }}
    >
      <h2 style={{ color: selectedTemplate.styles.primaryColor }}>
        Resume Preview
      </h2>

      <h3>{resumeData.personalInfo.fullName}</h3>
      <p>{resumeData.personalInfo.email}</p>
      <p>{resumeData.personalInfo.phone}</p>
    </div>
  );
};

export default ResumePreview;
