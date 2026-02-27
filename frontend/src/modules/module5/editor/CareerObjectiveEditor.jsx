import { useResume } from "../context/ResumeContext";

const CareerObjectiveEditor = () => {
  const { resumeData, setResumeData } = useResume();

  const handleChange = (e) => {
    setResumeData((prev) => ({
      ...prev,
      careerObjective: e.target.value,
    }));
  };

  return (
    <div>
      <h3>Career Objective</h3>
      <textarea
        value={resumeData.careerObjective || ""}
        onChange={handleChange}
        placeholder="Write your career objective..."
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "10px",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default CareerObjectiveEditor;
