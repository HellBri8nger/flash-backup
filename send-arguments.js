const axios = require('axios');

const gameId = process.argv[2];

axios.post('http://localhost:3000/cli-arguments', { id: gameId })
  .then(response => {
    console.log(`Server responded with status: ${response.status}`);
  })
  .catch(error => {
    console.error('Error sending request:', error);
  });
