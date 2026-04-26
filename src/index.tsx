// import './wdyd'
import "jira-dev-tool";
import React from "react";
import ReactDOM from "react-dom"; // 注意这里是 react-dom，不是 react-dom/client
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { loadServer, DevTools } from "jira-dev-tool";
import { AppProviders } from "context/index";
import "antd/dist/antd.less";
import { Profiler } from "components/profiler";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );
// const swUrl = process.env.NODE_ENV === 'production'
//   ? '/yiheng.github.io/mockServiceWorker.js'
//   : '/mockServiceWorker.js';

//负责初始化应用、加载 Mock 服务、渲染 React 应用
loadServer(() => {
  ReactDOM.render(
    <React.StrictMode>
      <Profiler id={"Root App"} phases={["mount"]}>
        <AppProviders>
          <DevTools />
          <App />
        </AppProviders>
      </Profiler>
    </React.StrictMode>,
    document.getElementById("root"),
  );
});
// 性能监控（可选）
reportWebVitals();
