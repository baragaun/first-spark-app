import { p as public_env } from './shared-server-i79vVjEm.js';
import { K as KCUApp, F as FirstSparkApp } from './translate-DAfkGQ1n.js';

let projectName = public_env.PUBLIC_PROJECTNAME;
const appTitle = () => {
  switch (projectName) {
    case "FirstSpark":
      return FirstSparkApp.title;
    case "KCU":
      return KCUApp.title;
    default:
      return "First Spark";
  }
};
let appDescription = () => {
  switch (projectName) {
    case "FirstSpark":
      return FirstSparkApp.description;
    case "KCU":
      return KCUApp.description;
    default:
      return "";
  }
};
let appCanonicalUrl = () => {
  switch (projectName) {
    case "FirstSpark":
      return FirstSparkApp.canonicalUrl;
    case "KCU":
      return KCUApp.canonicalUrl;
    default:
      return "";
  }
};
let headerIcon = () => {
  switch (projectName) {
    case "FirstSpark":
      return "/fs-logo.svg";
    case "KCU":
      return "/fs-logo-kcu-large.png";
    default:
      return "/fs-logo.svg";
  }
};
let headerSmallIcon = () => {
  switch (projectName) {
    case "FirstSpark":
      return "/fs-logo.svg";
    case "KCU":
      return "/fs-logo-kcu-small.png";
    default:
      return "/fs-logo.svg";
  }
};

export { appCanonicalUrl as a, appDescription as b, appTitle as c, headerIcon as d, headerSmallIcon as h };
//# sourceMappingURL=app-store.svelte-hO-d5cjK.js.map
