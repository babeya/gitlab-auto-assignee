const request = require("request");

const API_DOMAIN = "http://localhost";
const API_TOKEN = "Xzd4VGHD5Mye5EdW3mgZ";

const getFullApiUrl = (path: string) =>
  `${API_DOMAIN}/api/v4${path}?private_token=${API_TOKEN}`;

export const get = (path: string, callback: any) => {
  request.get(getFullApiUrl(path), (err, _, body) => {
    callback(body);
  });
};

/*
export const put = (
  {
    hostname,
    path,
    body,
    port,
  }: { hostname: string; path: string; body: any; port: string },
  callback: any
) => {
  var dataString = JSON.stringify(body);

  var result = "";

  var options = {
    hostname,
    port,
    path,
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": dataString.length,
    },
  };

  const req = http.request(options, (resp) => {
    resp.on("data", (chunk) => {
      result += chunk;
    });

    resp.on("end", () => {
      callback(result);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(body);
  req.end();
};
*/
