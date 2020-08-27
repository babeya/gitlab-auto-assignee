const http =  require('http');

// TODO: clean network management 

export const get = (url: string, callback: any) => {
  http.get(url, (resp) => {
    var data = "";

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      callback(data);
    });

    // TODO: error
  });
};


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
