import express from 'express';

export const app = express();
app.use(express.json());

app.use('/api', (req, res) => {
  res.json({
    info: 'Git Girls API up & running',
  });
});

//should this go in a serparte file? refactor?
export const startHttpApi = () => {
  const url = process.env.API_PORT;
  app.listen(url, () => {
    console.log('API up & running on port: ', url);
  });
};
