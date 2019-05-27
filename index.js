const express = require("express");
const { } = require("./config/keys");

const PORT = process.env.PORT || 5000;
const accessCorsAllow = require("./middlewares/accessCorsAllow");
const app = express();

app.listen(PORT, (err, res) => {
  console.log(`Server is running on ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded());

if( process.env.NODE_ENV !== 'production' ) {
  app.use(accessCorsAllow)
}

require("./routes/graphRoutes")(app);

if( process.env.NODE_ENV === 'production' ) {
  const path = require('path');
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}