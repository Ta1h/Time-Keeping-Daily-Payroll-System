import { useState } from "react";
import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import ModulesMain from "./modules";

function App() {
  const [activeModule, setActiveModule] = useState("employee_management");

  return (
    <div className="container">
      <div className="container-sidebar">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
      </div>
      <div className="container-content">
        <ModulesMain activeModule={activeModule} />
      </div>
    </div>
  );
}

export default App;
