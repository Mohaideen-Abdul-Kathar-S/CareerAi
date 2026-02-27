import React from "react";
import "./SplitTwoColumn.css";

const SplitTwoColumn = ({ data }) => {
  const {
    basics,
    summary,
    experience,
    education,
    skills,
    projects,
    languages,
    careerObjective,
  } = data;

  return (
    <div className="split-container">
      
      {/* LEFT COLUMN */}
      <div className="split-left">
        
        {/* NAME */}
        <h1 className="split-name">
          {basics.fullName || "Your Name"}
        </h1>

        {/* JOB TITLE (HEADLINE) */}
        {basics.headline && (
          <h2 className="split-job-title">
            {basics.headline}
          </h2>
        )}

        <div className="split-section">
          <h3>CONTACT</h3>
          {basics.email && <p>{basics.email}</p>}
          {basics.phone && <p>{basics.phone}</p>}
          {basics.location && <p>{basics.location}</p>}
        </div>

        {skills?.length > 0 && (
          <div className="split-section">
            <h3>SKILLS</h3>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {languages?.length > 0 && (
          <div className="split-section">
            <h3>LANGUAGES</h3>
            <ul>
              {languages.map((lang, index) => (
                <li key={index}>{lang}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="split-right">

        {careerObjective && (
          <div className="split-section">
            <h2>CAREER OBJECTIVE</h2>
            <p>{careerObjective}</p>
          </div>
        )}

        {summary && (
          <div className="split-section">
            <h2>PROFESSIONAL SUMMARY</h2>
            <p>{summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div className="split-section">
            <h2>WORK EXPERIENCE</h2>
            {experience.map((exp, index) => (
              <div key={index} className="split-item">
                <h4>{exp.position}</h4>
                <p className="split-company">
                  {exp.company} | {exp.startDate} - {exp.endDate}
                </p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {projects?.length > 0 && (
          <div className="split-section">
            <h2>PROJECTS</h2>
            {projects.map((proj, index) => (
              <div key={index} className="split-item">
                {proj.title && <h4>{proj.title}</h4>}
                {proj.description && <p>{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {education?.length > 0 && (
          <div className="split-section">
            <h2>EDUCATION</h2>
            {education.map((edu, index) => (
              <div key={index} className="split-item">
                <h4>{edu.degree}</h4>
                <p>
                  {edu.institution} | {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SplitTwoColumn;
