import { useResume } from "../context/ResumeContext";
import { useState } from "react";

const LanguagesEditor = () => {
  const { resumeData, setResumeData } = useResume();
  const [languageInput, setLanguageInput] = useState("");

  const addLanguage = () => {
    if (!languageInput) return;

    setResumeData((prev) => ({
      ...prev,
      languages: [...(prev.languages || []), languageInput],
    }));

    setLanguageInput("");
  };

  return (
    <div>
      <h3>Languages</h3>

      <input
        type="text"
        placeholder="Add language"
        value={languageInput}
        onChange={(e) => setLanguageInput(e.target.value)}
      />
      <button onClick={addLanguage}>Add</button>

      <ul>
        {(resumeData.languages || []).map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
    </div>
  );
};

export default LanguagesEditor;
