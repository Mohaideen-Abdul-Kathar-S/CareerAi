import { ResumeProvider } from "./context/ResumeContext";
import ResumeEditorApp from "./App";

export default function Module5App() {
    return (
        <ResumeProvider>
            <ResumeEditorApp />
        </ResumeProvider>
    );
}
