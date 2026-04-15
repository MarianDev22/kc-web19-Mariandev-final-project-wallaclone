import express from 'express';

const app = express();

app.use('/api', (req, res) => {
  const message = '<h1> Hello World </h1>';
  res.send(message);
  //     res.json({
  //     info: 'first endpoint',
  //   });
});

app.listen(3000, () => {
  console.log('up & running on port:', 3000);
});
