import React from "react";
import { useResume } from "../context/ResumeContext";
import "./EditorStyles.css";

const BasicsEditor = () => {
  const { resumeData, updateBasics } = useResume();

  return (
    <div className="editor-container">
      <h2>Basic Information</h2>

      {/* FULL NAME */}
      <div className="input-group">
        <label>Full Name</label>
        <input
          type="text"
          value={resumeData.basics.fullName}
          onChange={(e) =>
            updateBasics("fullName", e.target.value)
          }
          placeholder="John Doe"
        />
      </div>

      {/* HEADLINE */}
      <div className="input-group">
        <label>Headline</label>
        <input
          type="text"
          value={resumeData.basics.headline}
          onChange={(e) =>
            updateBasics("headline", e.target.value)
          }
          placeholder="Software Engineer"
        />
      </div>

      {/* EMAIL */}
      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          value={resumeData.basics.email}
          onChange={(e) =>
            updateBasics("email", e.target.value)
          }
          placeholder="john@example.com"
        />
      </div>

      {/* PHONE */}
      <div className="input-group">
        <label>Phone</label>
        <input
          type="text"
          value={resumeData.basics.phone}
          onChange={(e) =>
            updateBasics("phone", e.target.value)
          }
          placeholder="+91 9876543210"
        />
      </div>

      {/* LOCATION */}
      <div className="input-group">
        <label>Location</label>
        <input
          type="text"
          value={resumeData.basics.location}
          onChange={(e) =>
            updateBasics("location", e.target.value)
          }
          placeholder="Chennai, India"
        />
      </div>
    </div>
  );
};

export default BasicsEditor;
