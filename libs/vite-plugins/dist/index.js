import { isFunction, each } from "lodash-es";
import shell from "shelljs";
function hooksPlugin(props) {
  const { rmFiles = [], beforeBuild, afterBuild } = props;
  return {
    name: "hooks-plugin",
    buildStart() {
      each(rmFiles, (fName) => shell.rm("-rf", fName));
      isFunction(beforeBuild) && beforeBuild();
    },
    buildEnd(err) {
      !err && isFunction(afterBuild) && afterBuild();
    }
  };
}
export {
  hooksPlugin
};
