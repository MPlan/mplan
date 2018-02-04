import * as express from 'express';
export const api = express.Router();

api.get('/test', (req, res) => {
  res.json({ hello: 'world' });
});
