import { useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";
import "./ResumeForm.css";

const ResumeForm = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value
      }
    });
  };

  return (
    <div className="form-container">
      <h2>Personal Information</h2>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={resumeData.personalInfo.fullName}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={resumeData.personalInfo.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={resumeData.personalInfo.phone}
        onChange={handleChange}
      />
    </div>
  );
};

export default ResumeForm;
