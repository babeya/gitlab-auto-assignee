const request = require("request");

import config from "./config";
import debug from "./debug";

const getFullApiUrl = (path: string) =>
  `${config.gitlabUrl}/api/v4${path}?private_token=${config.token}`;

const requestCallback = (callback) => (err, _, body) => {
  try {
    if (err) {
      debug(err);
    }
    callback(JSON.parse(body));
  }
  catch (err) {
    debug(err.toString());
  }  
};

export const get = (path: string, callback: any) => {
  request.get(getFullApiUrl(path), requestCallback(callback));
};

// TODO: generics ?

export const put = (path: string, payload: any, callback: any) => {
  request.put(getFullApiUrl(path), payload, requestCallback(callback));
};