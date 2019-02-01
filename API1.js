const https = require('https');

// const promises = [];
// const accumulator = {};

const combineArray = (accumulator, current) => {
  let resolveGlobal;

  const promise = new Promise(((resolve, reject) => {
    resolveGlobal = resolve;
  }));
  const author = current.Author;

  let rating;
  https.get(`https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${current.id}`, (response) => {
    response.on('data', (data) => {
      rating = JSON.parse(data);
    });
    response.on('end', () => {
      if (accumulator[author] === undefined) {
        accumulator[author] = [];
        accumulator[author].push({
          Author: author,
          id: current.id,
          Name: current.Name,
          rating: rating.rating,
        });
      } else {
        accumulator[author].push({
          Author: author,
          id: current.id,
          Name: current.Name,
          rating: rating.rating,
        });
      }
      resolveGlobal(accumulator);
    });
  });
  return promise;
};

const initialCallback = (response, promises) => {
  let result = '';
  const accumulator = {};
  response.setEncoding('utf8').on('data', (data) => {
    result += data;
  });
  response.on('end', async () => {
    const books = JSON.parse(result).books;
    books.forEach((book) => {
      promises.push(combineArray(accumulator, book));
    });

    Promise.all(promises).then(() => console.log(accumulator));
  });
};

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
        promises.push(combineArray(accumulator, book));
      });

      Promise.all(promises).then(() => console.log(accumulator));
    });
  });
};

if (!module.parent) {
  makeGetRequest({}, []);
}

module.exports = { makeGetRequest, combineArray };

// const makeGetRequest =()=>{
// https.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks', callback);
// }
