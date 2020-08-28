const fs = require("fs");

import config from "../config";

const debug = (log: string) => {
  if (config.debug) {
    const now = new Date();
    fs.writeFileSync(config.debugOuput, `${now.toString()} : ${log}\n`, {
      flag: "a",
    });
  }
};

export default debug;
