import React from "react";
import "./Accent.css";

const Accent = ({ data }) => {
  const {
    basics,
    summary,
    experience,
    education,
    projects,
    skills,
    careerObjective,
  } = data;

  return (
    <div className="accent-container">

      {/* HEADER */}
      <div className="accent-header">
        <h1>{basics.fullName || "Your Name"}</h1>
        <div className="accent-line"></div>

        {basics.headline && (
          <h2 className="accent-job">{basics.headline}</h2>
        )}

        <p className="accent-contact">
          {basics.email} {basics.phone && ` | ${basics.phone}`}{" "}
          {basics.location && ` | ${basics.location}`}
        </p>
      </div>

      {/* CAREER OBJECTIVE */}
      {careerObjective && (
        <div className="accent-section">
          <h3>Career Objective</h3>
          <p>{careerObjective}</p>
        </div>
      )}

      {/* SUMMARY */}
      {summary && (
        <div className="accent-section">
          <h3>Professional Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience?.length > 0 && (
        <div className="accent-section">
          <h3>Work Experience</h3>

          {experience.map((exp, index) => (
            <div key={index} className="accent-item">
              <div className="accent-row">
                <h4>{exp.position}</h4>
                <span>
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>

              <p className="accent-company">{exp.company}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects?.length > 0 && (
        <div className="accent-section">
          <h3>Projects</h3>

          {projects.map((proj, index) => (
            <div key={index} className="accent-item">
              <div className="accent-row">
                <h4>{proj.title}</h4>
              </div>
              <p>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {education?.length > 0 && (
        <div className="accent-section">
          <h3>Education</h3>

          {education.map((edu, index) => (
            <div key={index} className="accent-item">
              <div className="accent-row">
                <h4>{edu.degree}</h4>
                <span>
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <p>{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills?.length > 0 && (
        <div className="accent-section">
          <h3>Core Skills</h3>
          <p>{skills.join(", ")}</p>
        </div>
      )}

    </div>
  );
};

export default Accent;
