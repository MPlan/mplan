import * as express from 'express';
import * as path from 'path';
import { api } from './api';
const app = express();
const port = parseInt(process.env.PORT || '8090');

app.use(express.static(path.resolve(__dirname, '../web-root')));

app.use('/api', api);

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../web-root/index.html'));
});

app.listen(port, () => console.log(`Server up on port: ${port}`));
