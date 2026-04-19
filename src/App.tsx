import React from "react";
import { ProjectListScreen } from "./screens/project-list/index";
import { LoginScreen } from "screens/login";

export default function App() {
  return (
    <div className="App">
      <LoginScreen />
      {/* 欢迎来到react的实际项目
      <ProjectListScreen /> */}
    </div>
  );
}
