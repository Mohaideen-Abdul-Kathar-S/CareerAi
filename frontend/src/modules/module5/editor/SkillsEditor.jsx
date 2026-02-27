import { useState } from "react";
import { useResume } from "../context/ResumeContext";

const SkillsEditor = () => {
  const { resumeData, addSkill, removeSkill } = useResume();
  const [newSkill, setNewSkill] = useState("");

  const handleAdd = () => {
    addSkill(newSkill);
    setNewSkill("");
  };

  return (
    <div>
      <h3>Skills</h3>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleAdd} style={buttonStyle}>
          Add
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        {resumeData.skills.map((skill, index) => (
          <div key={index} style={skillCard}>
            {skill}
            <button
              onClick={() => removeSkill(index)}
              style={removeBtn}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsEditor;


/* ======================= */

const inputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "8px 12px",
  background: "#5f4dee",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const skillCard = {
  display: "flex",
  justifyContent: "space-between",
  background: "#eee",
  padding: "8px 12px",
  borderRadius: "6px",
  marginBottom: "8px",
};

const removeBtn = {
  background: "transparent",
  border: "none",
  color: "red",
  cursor: "pointer",
};
