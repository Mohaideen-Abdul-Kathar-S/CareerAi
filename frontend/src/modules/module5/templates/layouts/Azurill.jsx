import { useResume } from "../../context/ResumeContext";

const Azurill = () => {
  const { resumeData } = useResume();

  const {
    basics,
    careerObjective,
    experience,
    projects,
    skills,
    languages,
  } = resumeData;

  return (
    <div
      style={{
        background: "#fff",
        padding: "40px",
        fontFamily: "Arial",
        width: "100%",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          background: "linear-gradient(90deg, #4f46e5, #6366f1)",
          padding: "20px",
          borderRadius: "10px",
          color: "white",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: 0 }}>
          {basics.fullName || "Your Name"}
        </h1>

        <p style={{ margin: "5px 0" }}>
          {basics.headline}
        </p>

        <p style={{ margin: 0 }}>
          {basics.email} | {basics.phone} | {basics.location}
        </p>
      </div>

      {/* ================= CAREER OBJECTIVE ================= */}
      {careerObjective && (
        <>
          <h2 style={{ borderBottom: "2px solid #4f46e5" }}>
            Career Objective
          </h2>
          <p>{careerObjective}</p>
        </>
      )}

      {/* EXPERIENCE */}
{resumeData.experience.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h3 style={{ borderBottom: "2px solid #5f4dee", paddingBottom: "5px" }}>
      Experience
    </h3>

    {resumeData.experience.map((exp, index) => (
      <div key={index} style={{ marginBottom: "15px" }}>
        <strong>{exp.position}</strong> - {exp.company}
        <p style={{ fontSize: "14px", color: "#666" }}>
          {exp.startDate} - {exp.endDate}
        </p>
        <p>{exp.description}</p>
      </div>
    ))}
  </div>
)}


      {/* ================= PROJECTS ================= */}
      {projects?.length > 0 && (
        <>
          <h2 style={{ borderBottom: "2px solid #4f46e5" }}>
            Projects
          </h2>

          {projects.map((project, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>{project.name}</strong>
              <p>{project.description}</p>
            </div>
          ))}
        </>
      )}

{/* SKILLS */}
{resumeData.skills.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h3 style={{ borderBottom: "2px solid #5f4dee", paddingBottom: "5px" }}>
      Skills
    </h3>

    <ul>
      {resumeData.skills.map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  </div>
)}


      {/* ================= LANGUAGES ================= */}
      {languages?.length > 0 && (
        <>
          <h2 style={{ borderBottom: "2px solid #4f46e5" }}>
            Languages
          </h2>

          <ul>
            {languages.map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Azurill;
