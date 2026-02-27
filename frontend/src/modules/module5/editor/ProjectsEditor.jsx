import React from "react";
import { useResume } from "../context/ResumeContext";

const ProjectsEditor = () => {
  const { resumeData, setResumeData } = useResume();

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: "",
        },
      ],
    }));
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects[index][field] = value;

    setResumeData((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const removeProject = (index) => {
    const updatedProjects = resumeData.projects.filter(
      (_, i) => i !== index
    );

    setResumeData((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  return (
    <div>
      <h3>Projects</h3>

      <button onClick={addProject}>+ Add Project</button>

      {resumeData.projects.map((project, index) => (
        <div key={index} style={{ marginTop: "15px" }}>
          <input
            type="text"
            placeholder="Project Title"
            value={project.title}
            onChange={(e) =>
              updateProject(index, "title", e.target.value)
            }
            style={{ width: "100%", marginBottom: "8px" }}
          />

          <textarea
            placeholder="Project Description"
            value={project.description}
            onChange={(e) =>
              updateProject(index, "description", e.target.value)
            }
            style={{ width: "100%", minHeight: "80px" }}
          />

          <button
            onClick={() => removeProject(index)}
            style={{
              marginTop: "8px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProjectsEditor;
