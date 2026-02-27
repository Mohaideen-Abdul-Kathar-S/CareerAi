import React from "react";
import "./ModernAccent.css";
import profileImg from "../../image/profile.png";   // ✅ IMPORTANT

const ModernAccent = ({ data }) => {
  const {
    basics = {},
    careerObjective,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
  } = data || {};

  return (
    <div className="modern-container">

      {/* HEADER */}
      <div className="modern-header">
        <div>
          <h1 className="modern-name">
            {basics.fullName || "Your Name"}
          </h1>

          {basics.headline && (
            <p className="modern-role">{basics.headline}</p>
          )}
        </div>

        <div className="modern-photo">
          <img
            src={profileImg}
            alt="Profile"
            className="modern-profile-img"
          />
        </div>
      </div>

      <div className="accent-line" />

      {/* CONTACT + EDUCATION + SKILLS GRID */}
      <div className="modern-contact-grid">

        <div>
          <h4>CONTACT INFO</h4>
          {basics.email && <p>{basics.email}</p>}
          {basics.phone && <p>{basics.phone}</p>}
          {basics.location && <p>{basics.location}</p>}
        </div>

        {education.length > 0 && (
          <div>
            <h4>EDUCATION</h4>
            {education.map((edu, i) => (
              <div key={i}>
                <strong>{edu.degree}</strong>
                <p>{edu.institution}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h4>LEADERSHIP / SKILLS</h4>
            <ul>
              {skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      <div className="accent-line thin" />

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <div className="modern-section">
          <h3>EXPERIENCE</h3>

          {experience.map((exp, i) => (
            <div key={i} className="modern-item">
              <strong>{exp.position}</strong>
              <p className="modern-company">
                {exp.company} | {exp.startDate} - {exp.endDate}
              </p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <div className="modern-section">
          <h3>PROJECTS</h3>

          {projects.map((proj, i) => (
            <div key={i} className="modern-item">
              <strong>{proj.title}</strong>
              <p>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* CAREER OBJECTIVE */}
      {careerObjective && (
        <div className="modern-section">
          <h3>CAREER OBJECTIVE</h3>
          <p>{careerObjective}</p>
        </div>
      )}

      {/* LANGUAGES */}
      {languages.length > 0 && (
        <div className="modern-section">
          <h3>LANGUAGES</h3>
          <div className="language-list">
            {languages.map((lang, i) => (
              <span key={i}>{lang}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ModernAccent;
