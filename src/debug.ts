const fs = require("fs");

const debug = (log: string) => {
  const now = new Date();

  // TODO: use config for log path
  fs.writeFileSync("/tmp/toto.txt", `${now.toString()} : ${log}\n`, { flag: "a" });
};

export default debug;
