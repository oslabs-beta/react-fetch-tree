import fiberwalker from "./fiberwalker";
import componentObj from "./componentStore";

const orgChartCreator = (orgChart) => {
  let __ReactFiberDOM;
  const devTools = global.__REACT_DEVTOOLS_GLOBAL_HOOK__;

  devTools.onCommitFiberRoot = (function (original) {
    return function (...args) {
      __ReactFiberDOM = args[1];
      console.log("dom: ", __ReactFiberDOM.current);
      console.log("inside onCommit", componentObj);
      orgChart["renderTree"] = fiberwalker(
        __ReactFiberDOM.current,
        componentObj
      );
      console.log("orgChart: ", orgChart);

      return original(...args);
    };
  })(devTools.onCommitFiberRoot);
};

export default orgChartCreator;
