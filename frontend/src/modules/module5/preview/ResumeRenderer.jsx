import React, { useRef } from "react";
import { useResume } from "../context/ResumeContext";
import { TEMPLATES } from "../templates/TemplateRegistry";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ResumeRenderer.css";

const ResumeRenderer = () => {
  const { resumeData, selectedTemplate } = useResume();
  const resumeRef = useRef();

  const SelectedLayout = TEMPLATES[selectedTemplate];

  const downloadPDF = async () => {
    const element = resumeRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("My_Resume.pdf");
  };

  if (!SelectedLayout) {
    return <div>No Template Selected</div>;
  }

  return (
    <div className="resume-preview-wrapper">
      
      {/* PREVIEW AREA */}
      <div className="resume-preview-paper" ref={resumeRef}>
        <SelectedLayout data={resumeData} />
      </div>

      {/* DOWNLOAD BUTTON AT BOTTOM */}
      <div className="download-btn-wrapper">
        <button onClick={downloadPDF} className="download-btn">
          Download Resume as PDF
        </button>
      </div>

    </div>
  );
};

export default ResumeRenderer;
