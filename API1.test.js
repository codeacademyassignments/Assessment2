const functions = require('./API1.js');

describe('promise', () => {
  const promises = [];
  it('should have two properties', (done) => {
    const callback = (response) => {
      let result = '';
      response.setEncoding('utf8').on('data', (data) => {
        result += data;
      });
      response.on('end', async () => {
        const books = JSON.parse(result).books;
        books.forEach((book) => {
          promises.push(functions.combineArray(book));
        });

        Promise.all(promises).then((data) => {
          expect(data['Sidney Sheldon'].length).toEqual(7);
        });

        done();
        // .then(() => console.log(accumulator));
      });
    };
    promise.then((data) => {
      expect(data['J K Rowling'].length).toEqual(7);
    });
  });
});
