import { axios } from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:1234/v1',
  headers: { 'Authorization': 'Bearer lm-studio' }
});

const requestData = {
  model: 'Toppy/Toppy-GGUF',
  messages: [
    { role: 'system', content: 'Always answer in rhymes.' },
    { role: 'user', content: 'Introduce yourself.' }
  ],
  temperature: 0.7
};

client.post('/chat/completions', requestData)
  .then(response => {
    console.log(response.data.choices[0].message);
  })
  .catch(error => {
    console.error('Error:', error);
  });
