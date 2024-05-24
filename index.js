const http = require("http");
const { port, defaultResponseTime } = require("./config");
const {
  getAllApi,
  getFullPathMock,
  sleep,
  collectRequestBody,
} = require("./core");

const allAPI = getAllApi();

const routeHandler = async (request, response) => {
  const reqMethod = request.method;
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (allAPI.includes(url.pathname)) {
    const filePath = getFullPathMock(url.pathname);
    const mock = require(`./${filePath}`);
    const mockInternalServerError = mock?.config?.internalServerError ?? false;

    if (mockInternalServerError) {
      await sleep(defaultResponseTime);
      response.writeHead(500).end();
    } else {
      const allowedMethod = Object.keys(mock).filter((key) => key !== "config");
      if (allowedMethod.includes(reqMethod)) {
        const query =
          [...url.searchParams.entries()].length > 0
            ? [...url.searchParams.entries()].reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
              }, {})
            : undefined;
        const body = await collectRequestBody(request);
        const mockData = mock[reqMethod]({ query, body });

        await sleep(mockData?.responseTime ?? defaultResponseTime);
        response
          .writeHead(mockData.responseStatus ?? 200, {
            "Content-Type": "application/json",
          })
          .end(
            JSON.stringify(mockData.response[mockData.responseStatus ?? 200])
          );
      } else {
        response
          .writeHead(405, {
            "Content-Type": "application/json",
          })
          .end(
            JSON.stringify({
              status: 405,
              message: "Method not allowed",
            })
          );
      }
    }
  } else {
    response
      .writeHead(404, {
        "Content-Type": "application/json",
      })
      .end(
        JSON.stringify({
          status: 404,
          message: `API not found at ${request.url}`,
        })
      );
  }
};

const server = http.createServer((request, response) => {
  return routeHandler(request, response);
});
server.listen(port, () => {
  console.info(`Mock Server is running on Port ${port}`);
});
