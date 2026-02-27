import React, { createContext, useContext, useState } from "react";

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  // =============================
  // DEFAULT RESUME STRUCTURE
  // =============================
  const [resumeData, setResumeData] = useState({
    basics: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
    },
    careerObjective: "",
    summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
  });

  // =============================
  // TEMPLATE STATE
  // =============================
  const [selectedTemplate, setSelectedTemplate] = useState("azurill");

  // =============================
  // ACTIVE SECTION STATE
  // =============================
  const [activeSection, setActiveSection] = useState("basics");

  // =============================
  // 🌙 DARK MODE STATE
  // =============================
  const [darkMode, setDarkMode] = useState(false);

  // =============================
  // BASICS UPDATE
  // =============================
  const updateBasics = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        [field]: value,
      },
    }));
  };

  // =============================
  // SUMMARY UPDATE
  // =============================
  const updateSummary = (value) => {
    setResumeData((prev) => ({
      ...prev,
      summary: value,
    }));
  };

  // =============================
  // EXPERIENCE HANDLERS
  // =============================
  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...resumeData.experience];
    updated[index][field] = value;

    setResumeData((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  const removeExperience = (index) => {
    const updated = resumeData.experience.filter((_, i) => i !== index);

    setResumeData((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  // =============================
  // EDUCATION HANDLERS
  // =============================
  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
        },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...resumeData.education];
    updated[index][field] = value;

    setResumeData((prev) => ({
      ...prev,
      education: updated,
    }));
  };

  const removeEducation = (index) => {
    const updated = resumeData.education.filter((_, i) => i !== index);

    setResumeData((prev) => ({
      ...prev,
      education: updated,
    }));
  };

  // =============================
  // SKILLS HANDLERS
  // =============================
  const addSkill = (skill) => {
    if (!skill) return;

    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const removeSkill = (index) => {
    const updated = resumeData.skills.filter((_, i) => i !== index);

    setResumeData((prev) => ({
      ...prev,
      skills: updated,
    }));
  };

  // =============================
  // CONTEXT VALUE
  // =============================
  const value = {
    resumeData,
    setResumeData,

    selectedTemplate,
    setSelectedTemplate,

    activeSection,
    setActiveSection,

    darkMode,
    setDarkMode,

    updateBasics,
    updateSummary,

    addExperience,
    updateExperience,
    removeExperience,

    addEducation,
    updateEducation,
    removeEducation,

    addSkill,
    removeSkill,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

// =============================
// CUSTOM HOOK
// =============================
export const useResume = () => {
  return useContext(ResumeContext);
};
