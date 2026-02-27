import React from "react";
import "./Chikorita.css";

const Chikorita = ({ data }) => {
  const {
    basics,
    summary,
    experience,
    education,
    projects,
    skills,
    languages,
    careerObjective,
  } = data;

  return (
    <div className="chiko-container">

      {/* HEADER */}
      <div className="chiko-header">
        <h1>{basics.fullName || "Your Name"}</h1>

        {/* ✅ HEADLINE FIX */}
        {basics.headline && (
          <h3 className="chiko-headline">
            {basics.headline}
          </h3>
        )}

        <div className="chiko-contact">
          <div>
            {basics.email && <p><strong>Email:</strong> {basics.email}</p>}
            {basics.location && <p><strong>Address:</strong> {basics.location}</p>}
          </div>

          <div>
            {basics.phone && <p><strong>Phone:</strong> {basics.phone}</p>}
          </div>
        </div>
      </div>

      {/* SUMMARY / OBJECTIVE */}
      {(careerObjective || summary) && (
        <div className="chiko-summary-card">
          <p>{careerObjective || summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience?.length > 0 && (
        <div className="chiko-section">
          <h2>Experience</h2>

          {experience.map((exp, index) => (
            <div key={index} className="chiko-exp-item">
              <h4>
                {exp.position} {exp.company && `at ${exp.company}`}{" "}
                <span>
                  ({exp.startDate} - {exp.endDate})
                </span>
              </h4>

              {exp.description && (
                <ul>
                  {exp.description.split("\n").map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projects?.length > 0 && (
        <div className="chiko-section">
          <h2>Projects</h2>

          {projects.map((proj, index) => (
            <div key={index} className="chiko-exp-item">
              {proj.title && <h4>{proj.title}</h4>}

              {proj.description && (
                <ul>
                  {proj.description.split("\n").map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {education?.length > 0 && (
        <div className="chiko-section">
          <h2>Education</h2>

          {education.map((edu, index) => (
            <div key={index} className="chiko-exp-item">
              <h4>
                {edu.degree}
                <span>
                  {" "}({edu.startDate} - {edu.endDate})
                </span>
              </h4>
              {edu.institution && <p>{edu.institution}</p>}
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skills?.length > 0 && (
        <div className="chiko-section">
          <h2>Skills</h2>
          <p>{skills.join(", ")}</p>
        </div>
      )}

      {/* ✅ LANGUAGES FIX */}
      {languages?.length > 0 && (
        <div className="chiko-section">
          <h2>Languages</h2>
          <p>{languages.join(", ")}</p>
        </div>
      )}

    </div>
  );
};

export default Chikorita;
