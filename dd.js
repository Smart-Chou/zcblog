import express from 'express';

const app = express();
const port = 2334;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

