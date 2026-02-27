import TemplateSelector from "./TemplateSelector";
import "./SectionSidebar.css";

const SectionSidebar = () => {
  return (
    <div className="sidebar-container">
      <h2>Fill Section</h2>

      <ul>
        <li>Personal Info</li>
        <li>Summary</li>
        <li>Education</li>
        <li>Experience</li>
        <li>Skills</li>
      </ul>

      <hr />

      <TemplateSelector />
    </div>
  );
};

export default SectionSidebar;
