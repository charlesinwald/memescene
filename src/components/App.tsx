import * as React from "react";
import { hot } from "react-hot-loader";
import Header from "./common/Header"
import MemeGenerator from "./MemeGenerator";
const reactLogo = require("./../assets/img/react_logo.svg");
// import "./../assets/scss/App.scss";
import "./../styles/tailwind.css";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <div className="app bg-gray-800">
        <Header />
        <MemeGenerator />
      </div>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
