const request = require("request");

import config from "../config";
import debug from "./debug";

const getFullApiUrl = (path: string) =>
  `${config.gitlabUrl}/api/v4${path}?private_token=${config.token}`;

const requestCallback = (callback) => (err, _, body) => {
  try {
    if (err) {
      debug(err.message || err.toString());
    }
    callback(body);
  } catch (err) {
    debug(err.message || err.toString());
  }
};

export const get = (path: string, callback: any) => {
  request.get(
    { uri: getFullApiUrl(path), json: true },
    requestCallback(callback)
  );
};

// TODO: generics ?

export const put = (path: string, body: any, callback: any) => {
  request.put(
    { url: getFullApiUrl(path), json: true, body },
    requestCallback(callback)
  );
};
