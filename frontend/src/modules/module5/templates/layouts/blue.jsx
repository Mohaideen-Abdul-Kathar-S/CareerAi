import React from "react";
import "./Blue.css";

const Blue = ({ data }) => {
  const {
    basics,
    summary,
    careerObjective,
    experience,
    education,
    skills,
    projects,
    languages,
  } = data;

  return (
    <div className="blue-container">

      {/* ================= HEADER ================= */}
      <div className="blue-header">
        <h1>{basics.fullName || "YOUR NAME"}</h1>
        <p>{basics.headline || "Professional Title"}</p>
      </div>

      <div className="blue-body">

        {/* ========== LEFT COLUMN ========== */}
        <div className="blue-left">

          <div className="blue-section">
            <h3>CONTACT</h3>
            <p>{basics.email}</p>
            <p>{basics.phone}</p>
            <p>{basics.location}</p>
          </div>

          {education?.length > 0 && (
            <div className="blue-section">
              <h3>EDUCATION</h3>
              {education.map((edu, index) => (
                <div key={index} className="blue-item">
                  <strong>{edu.degree}</strong>
                  <p>{edu.institution}</p>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          )}

          {skills?.length > 0 && (
            <div className="blue-section">
              <h3>SKILLS</h3>
              <ul>
                {skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {languages?.length > 0 && (
            <div className="blue-section">
              <h3>LANGUAGES</h3>
              <ul>
                {languages.map((lang, index) => (
                  <li key={index}>{lang}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* ========== RIGHT COLUMN ========== */}
        <div className="blue-right">

          {careerObjective && (
            <div className="blue-section">
              <h3>CAREER OBJECTIVE</h3>
              <p>{careerObjective}</p>
            </div>
          )}

          {summary && (
            <div className="blue-section">
              <h3>SUMMARY</h3>
              <p>{summary}</p>
            </div>
          )}

          {experience?.length > 0 && (
            <div className="blue-section">
              <h3>WORK EXPERIENCE</h3>
              {experience.map((exp, index) => (
                <div key={index} className="blue-item">
                  <strong>{exp.position}</strong>
                  <p>{exp.company}</p>
                  <span>{exp.startDate} - {exp.endDate}</span>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {projects?.length > 0 && (
            <div className="blue-section">
              <h3>PROJECTS</h3>
              {projects.map((proj, index) => (
                <div key={index} className="blue-item">
                  <strong>{proj.title}</strong>
                  <p>{proj.description}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Blue;
