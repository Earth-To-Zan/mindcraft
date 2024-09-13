import { strictFormat } from '../utils/text.js';

import http from 'http';

export class Local {
    constructor(model_name) {
        this.model_name = model_name
    }

    async sendRequest(turns, systemMessage) {
        // let model = 'Toppy/Toppy-GPTJ';
        let model = this.model_name;
       
        let messages = strictFormat(turns);

        messages.unshift({role: 'system', content: systemMessage});
     
        let res = null;

        const data = JSON.stringify({
            model: 'Toppy/Toppy-GGUF',
            messages: messages,
            temperature: 0.7
        });

        const options = {
            hostname: 'localhost',
            port: 1234,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer lm-studio',
              'Content-Length': data.length
            }
        };
      
        let results = null;

        try {
           console.log(`Awaiting local response... (model: ${model})`)
           
            const req = http.request(options, res => {
              let responseData = '';

              res.on('data', chunk => {
                responseData += chunk;
              });
            
              res.on('end', () => { 
                const result = JSON.parse(responseData);
                // console.log(result.choices[0].message);
                results = result.choices[0].message;
                console.log("TOPPY_RESPONSE: " + results.content);
              });
            });
            
            req.on('error', error => {
              console.error('Error:', error);
            });

            req.write(data);
            req.end();
      
          // Wait for the results to be defined
          while (results === null) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          console.log(results.content);
      
          return results.content;
        } catch (err) {
          console.log(err.message.toLowerCase().includes('context length'), err.message.length > 1);
          if (err.message.toLowerCase().includes('context length') && err.message.length > 1) {
            return 'My brain disconnected, try again.';
          } else {
            console.log(err);
            throw err;
          }
        }
      }

    // async embed(text) {
    //     let model = this.model_name || 'nomic-embed-text';
    //     let body = {model: model, prompt: text};
    //     let res = await this.send(this.embedding_endpoint, body);
    //     return res['embedding']
    // }

    // async send(endpoint, body) {
    //     const url = new URL(endpoint, this.url);
    //     let method = 'POST';
    //     let headers = new Headers();
    //     const request = new Request(url, {method, headers, body: JSON.stringify(body)});
    //     let data = null;
    //     try {
    //         const res = await fetch(request);
    //         if (res.ok) {
    //             data = await res.json();
    //         } else {
    //             throw new Error(`Ollama Status: ${res.status}`);
    //         }
    //     } catch (err) {
    //         console.error('Failed to send Ollama request.');
    //         console.error(err);
    //     }
    //     return data;
    // }
}