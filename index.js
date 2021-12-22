const { json } = require('express');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;
const path = require('path');
const { all } = require('express/lib/application');
const pathTofile = path.resolve('./data.json');

const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));
app.use(express.json());
const getResources = () => JSON.parse(fs.readFileSync(pathTofile, 'utf8'));

app.get('/api/resources', (req, res) => {
  res.json(getResources());
});

app.get('/api/activeresource', (req, res) => {
  const resources = getResources();
  const acitveResource = resources.find((x) => x.status === 'active');
  res.json(acitveResource);
});

app.get('/api/resources/:id', (req, res) => {
  const { id } = req.params;
  res.json(
    getResources().find((resource) => resource.id.toString() === id.toString())
  );
});

app.post('api/getUsers', (req, res) => {
  let id = null;
  if (req.params.id) {
    updateDetails();
  } else {
    createDetails();
  }
});

app.delete('/api/resources/delete/:id', (req, res) => {
  if (req.body.params) {
    console.log(req.body.params);
  }
});

app.post('api/getUsers', (req, res) => {
  res.send('thank you visiting getUsers API. than kyou very much');

  res.send('t');
});

app.post('/api/resources', (req, res) => {
  const resources = getResources();
  const resource = req.body;
  resource.createdAt = new Date();
  resource.status = 'inactive';
  resource.id = Date.now().toString();
  resources.unshift(resource);

  const isSaved = saveData(resources);
  console.log('isSaved', isSaved);
  isSaved
    ? res.json(resource)
    : res.status(422).send('cannot store data in the file');
});

app.patch('/api/resources/:id', (req, res) => {
  const resources = getResources();
  const resource = req.body;
  const { id } = req.params;

  const r = resources.find((item) => item.id === id);
  console.log('r', r.status);

  if (
    resources.find((item) => item.id === resource.id).status === 'completed'
  ) {
    return res.status(422).send('resource completed, cannot update');
  }

  if (resource.status === 'active') {
    resource.activationTime = new Date();
  }
  const newData = resources.map((r) => (r.id === resource.id ? resource : r));
  const isSaved = saveData(newData);

  res.json(resource);
});

const saveData = (resources) => {
  fs.writeFile(pathTofile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      console.log('error saving data bla');
      console.log('error', error);
      return false;
    } else {
      console.log('tre');
      return true;
    }
  });

  return true;
};

app.listen(PORT, () => {
  console.log(`Server is up and listening on port ${PORT}!`);
});
