module.exports = {
  GET: ({ query, body }) => ({
    responseTime: 1000,
    responseStatus: 200,
    response: {
      200: {
        status: 200,
        message: "ok",
      },
    },
  }),
};
