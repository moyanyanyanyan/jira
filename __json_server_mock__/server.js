// 这是模块方式 - 直接 require，不执行任何命令
const jsonServer = require("json-server");
const { customMiddleware } = require("./middleware.js");

const server = jsonServer.create();
const router = jsonServer.router("db.json"); // ← 使用相对路径
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(customMiddleware);
server.use(router);

server.listen(3001, () => {
  console.log("JSON Server is running on port 3001");
});
