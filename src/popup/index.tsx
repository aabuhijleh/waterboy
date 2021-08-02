import React from "react";
import ReactDOM from "react-dom";
import { App } from "@/popup/App";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
  }

  html {
    box-sizing: border-box;
  }

  body {
    background-color: #000;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
