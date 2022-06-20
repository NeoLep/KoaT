const Koa = require("koa");

<% for(let i=0; i < modules.length; i++) { %>
const <%= variable[i] %> = require("./<%= modules[i] %>");<% } %>

const port = 3300; // server port
const app = new Koa; // load koa

<% for(let i=0; i < variable.length; i++) { %>
new <%= variable[i] %>(app);<% } %>

app.listen(port, () => {
   console.log("koa server is running at port: " + port);
   console.log("server at http://localhost:3300");
});

const Koat = require('./Koat')
<% for(let i=0; i < moduleTree.length; i++) { %>
const <%= variable[i] %> = require("./<%= modules[i] %>");<% } %>
const router = require('./router')

new Koat({
  router
})