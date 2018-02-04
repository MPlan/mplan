import * as express from 'express';
import * as path from 'path';
const app = express();
const port = parseInt(process.env.PORT || '8090');

app.use(express.static(path.resolve(__dirname, '../web-root')));

app.get('/api/test', (req, res) => {
  res.json({ hello: 'world' });
});

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../web-root/index.html'));
});

app.listen(port, () => console.log(`Server up on port: ${port}`));
