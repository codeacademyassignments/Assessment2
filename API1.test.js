const https = require('https');
const functions = require('./API1.js');

describe('promise', () => {
  // const promises = [];
  // const accumulator = {};
  it('should have two properties', (done) => {
    const makeGetRequest = (accumulator, promises) => {
      https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', (response) => {
        let result = '';
        // const accumulator = {};
        response.setEncoding('utf8').on('data', (data) => {
          result += data;
        });
        response.on('end', async () => {
          const books = JSON.parse(result).books;
          books.forEach((book) => {
            promises.push(functions.combineArray(accumulator, book));
          });

          return Promise.all(promises).then(() => {
            expect(accumulator['J K Rowling'].length).toEqual(7);
            expect(accumulator['Sidney Sheldon'].length).toEqual(5);
          });
        });
      });
      done();
    };
    makeGetRequest({}, []);
  });
});
