const request = require('supertest');
const express = require('express');

const app = express();
const router = require('../server');

app.use(router);

describe('GET', () => {
  describe('/', () => {
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
  
  describe('/dashboard', () => {
    it('respond with 200', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err && res !== null) {
          return done(err);
        }
        return done();
      });
    });
  });
});