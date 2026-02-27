import { useState } from "react";

import BasicsEditor from "./BasicsEditor";
import ExperienceEditor from "./ExperienceEditor";
import SkillsEditor from "./SkillsEditor";
import CareerObjectiveEditor from "./CareerObjectiveEditor";
import ProjectsEditor from "./ProjectsEditor";
import LanguagesEditor from "./LanguagesEditor";

const SectionsPanel = () => {
  const [activeSection, setActiveSection] = useState("basics");

  const renderSection = () => {
    switch (activeSection) {
      case "careerObjective":
        return <CareerObjectiveEditor />;

      case "experience":
        return <ExperienceEditor />;

      case "projects":
        return <ProjectsEditor />;

      case "skills":
        return <SkillsEditor />;

      case "languages":
        return <LanguagesEditor />;

      default:
        return <BasicsEditor />;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Sections</h2>

      <div style={{ marginBottom: "20px" }}>
        <p
          onClick={() => setActiveSection("basics")}
          style={{ cursor: "pointer" }}
        >
          Basics
        </p>

        <p
          onClick={() => setActiveSection("careerObjective")}
          style={{ cursor: "pointer" }}
        >
          Career Objective
        </p>

        <p
          onClick={() => setActiveSection("experience")}
          style={{ cursor: "pointer" }}
        >
          Experience
        </p>

        <p
          onClick={() => setActiveSection("projects")}
          style={{ cursor: "pointer" }}
        >
          Projects
        </p>

        <p
          onClick={() => setActiveSection("skills")}
          style={{ cursor: "pointer" }}
        >
          Skills
        </p>

        <p
          onClick={() => setActiveSection("languages")}
          style={{ cursor: "pointer" }}
        >
          Languages
        </p>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {renderSection()}
    </div>
  );
};

export default SectionsPanel;
