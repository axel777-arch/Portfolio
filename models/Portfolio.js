const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'portfolio.json');

// Ensure data folder and file exist
const init = () => {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({
      name: "Ezra Ambaw",
      bio: "Tech enthusiast, KUE SSC '28, EAII 25'. Building interfaces, training models, and editing video, one project at a time.",
      picture: "/assets/ezra.jpg",
      projects: []
    }, null, 2));
  }
};

const read = () => {
  init();
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
};

const write = (data) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

module.exports = { read, write };
