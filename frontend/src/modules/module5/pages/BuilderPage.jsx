import React from "react";
import { useResume } from "../context/ResumeContext";
import SectionsPanel from "../editor/SectionsPanel";
import ResumeRenderer from "../preview/ResumeRenderer";
import TemplateSelector from "../components/TemplateSelector";
import "./BuilderPage.css";

const BuilderPage = () => {
  const { darkMode, setDarkMode } = useResume();

  return (
    <div className={`builder-container ${darkMode ? "dark" : ""}`}>

      {/* LEFT PANEL */}
      <div className="builder-left">
        <SectionsPanel />
      </div>

      {/* CENTER PREVIEW */}
      <div className="builder-center">
        <ResumeRenderer />
      </div>

      {/* RIGHT PANEL */}
      <div className="builder-right">

        {/* HEADER WITH TOGGLE */}
        <div className="right-header">
          <h2 className="templates-title">Templates</h2>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <TemplateSelector />
      </div>

    </div>
  );
};

export default BuilderPage;
