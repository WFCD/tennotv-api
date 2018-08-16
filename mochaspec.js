const request = require('supertest');
const express = require('express');

const app = express();
const router = require('./server');

app.use(router);

describe('GET /', () => {
  it('respond with 200', done => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err && res !== null) {
          return done(err);
        }
        return done();
      });
  });
});