module.exports = {
  config: {
    internalServerError: false,
  },
  GET: ({ query, body }) => ({
    // responseTime: 3000,
    responseStatus: 200,
    response: {
      200: {
        status: 200,
        message: "success",
        data: {
          name: "Juki",
          gender: "Male",
          region: "Indonesia",
        },
      },
    },
  }),
  PATCH: ({ query, body }) => ({
    // responseTime: 3000,
    responseStatus: 200,
    response: {
      200: {
        status: 200,
        message: "update success",
      },
    },
  }),
};
