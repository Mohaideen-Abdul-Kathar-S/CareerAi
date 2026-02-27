import { useResume } from "../context/ResumeContext";

const ExperienceEditor = () => {
  const {
    resumeData,
    addExperience,
    updateExperience,
    removeExperience,
  } = useResume();

  return (
    <div>
      <h3>Experience</h3>

      <button onClick={addExperience} style={buttonStyle}>
        + Add Experience
      </button>

      {resumeData.experience.map((exp, index) => (
        <div key={index} style={cardStyle}>
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) =>
              updateExperience(index, "company", e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Position"
            value={exp.position}
            onChange={(e) =>
              updateExperience(index, "position", e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Start Date"
            value={exp.startDate}
            onChange={(e) =>
              updateExperience(index, "startDate", e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="End Date"
            value={exp.endDate}
            onChange={(e) =>
              updateExperience(index, "endDate", e.target.value)
            }
            style={inputStyle}
          />

          <textarea
            placeholder="Description"
            value={exp.description}
            onChange={(e) =>
              updateExperience(index, "description", e.target.value)
            }
            style={{ ...inputStyle, height: "80px" }}
          />

          <button
            onClick={() => removeExperience(index)}
            style={deleteBtn}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExperienceEditor;


/* =======================
   STYLES
======================= */

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "8px",
  marginTop: "15px",
  background: "#f9f9f9",
};

const buttonStyle = {
  padding: "8px 12px",
  background: "#5f4dee",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "red",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
