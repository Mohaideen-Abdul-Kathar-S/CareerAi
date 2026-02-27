import React from "react";
import "./Leafish.css";

const Leafish = ({ data }) => {
  const {
    basics,
    summary,
    experience,
    skills,
    languages,
    careerObjective,
    projects,
  } = data;

  return (
    <div className="leafish-container">

      {/* HEADER */}
      <div className="leafish-header">
        <h1>{basics.fullName || "Your Name"}</h1>
        {basics.headline && <h3>{basics.headline}</h3>}

        <div className="leafish-contact">
          {basics.phone && <span>📞 {basics.phone}</span>}
          {basics.location && <span>📍 {basics.location}</span>}
          {basics.email && <span>✉ {basics.email}</span>}
        </div>
      </div>

      <div className="leafish-body">

        {/* LEFT SIDE */}
        <div className="leafish-left">

          {/* CAREER OBJECTIVE */}
          {careerObjective && (
            <div className="leafish-section">
              <h2>CAREER OBJECTIVE</h2>
              <p>{careerObjective}</p>
            </div>
          )}

          {/* SUMMARY */}
          {summary && (
            <div className="leafish-section">
              <h2>SUMMARY</h2>
              <p>{summary}</p>
            </div>
          )}

          {/* EXPERIENCE */}
          {experience?.length > 0 && (
            <div className="leafish-section">
              <h2>EXPERIENCE</h2>

              {experience.map((exp, index) => (
                <div key={index} className="leafish-exp">
                  {exp.position && <h4>{exp.position}</h4>}
                  {exp.company && (
                    <p className="leafish-company">{exp.company}</p>
                  )}
                  {(exp.startDate || exp.endDate) && (
                    <span className="leafish-date">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  )}
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {projects?.length > 0 && (
            <div className="leafish-section">
              <h2>PROJECTS</h2>

              {projects.map((proj, index) => (
                <div key={index} className="leafish-exp">
                  {proj.title && <h4>{proj.title}</h4>}
                  {proj.description && <p>{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="leafish-right">

          {/* SKILLS */}
          {skills?.length > 0 && (
            <div className="leafish-section">
              <h2>PERSONAL VALUES</h2>

              <div className="leafish-skill-tags">
                {skills.map((skill, index) => (
                  <span key={index} className="leafish-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages?.length > 0 && (
            <div className="leafish-section">
              <h2>LANGUAGES</h2>

              {languages.map((lang, index) => (
                <div key={index} className="leafish-language">
                  <span>{lang}</span>

                  <div className="leafish-dots">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < 4
                            ? "dot active"
                            : "dot"
                        }
                      ></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Leafish;
