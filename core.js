const fs = require("fs");
const path = require("path");
const config = {
  mockDirName: "mocks",
  mockFileName: "mock.js",
};
const sleep = async (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};
const safelyParseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return undefined;
  }
};
const collectRequestBody = (req) => {
  return new Promise(async (resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      const data = Buffer.concat(chunks);
      const stringData = data.toString();
      const parsedData = safelyParseJSON(stringData);
      resolve(parsedData);
    });
  });
};
const findFileRecursive = (dir, filename) => {
  let results = [];

  function searchDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    items.forEach((item) => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        searchDirectory(fullPath);
      } else if (stat.isFile() && path.basename(fullPath) === filename) {
        results.push(fullPath.slice(dir.length));
      }
    });
  }

  searchDirectory(dir);
  return results;
};
const getAllApi = () => {
  const foundFiles = findFileRecursive(config.mockDirName, config.mockFileName);
  return foundFiles.map((apiName) => {
    const removedFileName = apiName.slice(0, apiName.length - 7);
    const result =
      removedFileName === "/"
        ? removedFileName
        : removedFileName.endsWith("/")
        ? removedFileName.slice(0, removedFileName.length - 1)
        : removedFileName;
    return result;
  });
};
const getFullPathMock = (endpoint) => {
  const result =
    endpoint === "/"
      ? path.join(config.mockDirName, config.mockFileName)
      : path.join(config.mockDirName, endpoint, config.mockFileName);
  return result;
};
module.exports = {
  findFileRecursive,
  getAllApi,
  getFullPathMock,
  sleep,
  collectRequestBody,
};
