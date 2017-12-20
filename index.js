const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.resolve(__dirname, './')));

app.listen(process.env.PORT || 8080, () => console.log('server up'));