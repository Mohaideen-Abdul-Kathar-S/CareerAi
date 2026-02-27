import React from "react";
import "./MinimalLine.css";

const MinimalLine = ({ data }) => {
  const {
    basics,
    careerObjective,
    experience,
    projects,
    skills,
    languages,
  } = data;

  return (
    <div className="minimal-container">

      {/* HEADER */}
      <div className="minimal-header">
        <h1>{basics.fullName || "Your Name"}</h1>
        <p>
          {basics.headline} {basics.location && `• ${basics.location}`}
        </p>
        <p>
          {basics.email} {basics.phone && `• ${basics.phone}`}
        </p>
      </div>

      {/* CAREER OBJECTIVE */}
      {careerObjective && (
        <>
          <div className="minimal-divider"></div>
          <section>
            <h2>Career Objective</h2>
            <p>{careerObjective}</p>
          </section>
        </>
      )}

      {/* EXPERIENCE */}
      {experience?.length > 0 && (
        <>
          <div className="minimal-divider"></div>
          <section>
            <h2>Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="minimal-item">
                <h3>{exp.position}</h3>
                <p className="sub">
                  {exp.company} • {exp.startDate} - {exp.endDate}
                </p>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>
        </>
      )}

      {/* PROJECTS */}
      {projects?.length > 0 && (
        <>
          <div className="minimal-divider"></div>
          <section>
            <h2>Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="minimal-item">
                <h3>{proj.name}</h3>
                <p>{proj.description}</p>
              </div>
            ))}
          </section>
        </>
      )}

      {/* SKILLS */}
      {skills?.length > 0 && (
        <>
          <div className="minimal-divider"></div>
          <section>
            <h2>Skills</h2>
            <p>{skills.join(", ")}</p>
          </section>
        </>
      )}

      {/* LANGUAGES */}
      {languages?.length > 0 && (
        <>
          <div className="minimal-divider"></div>
          <section>
            <h2>Languages</h2>
            <p>{languages.join(", ")}</p>
          </section>
        </>
      )}

    </div>
  );
};

export default MinimalLine;
