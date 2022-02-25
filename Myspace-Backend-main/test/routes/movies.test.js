const request = require('supertest');
const {Movies} = require('../../models/movies');
const mongoose = require('mongoose');

let server;

describe('/api/movies', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Movies.remove({});
  });

  describe('GET /', () => {
    it('should return all movies', async () => {
      const movies = [
        { name: 'movie1' },
        { name: 'movie2' },
      ];
      
      await Movies.collection.insertMany(movies);

      const res = await request(server).get('/api/movies');
      
      expect(res.status).toBe(200);
      expect(res.body.some(g => g.name === 'movie1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'movie2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a movie if valid id is passed', async () => {
      const movie = new Movies({ name: 'movie1' });
      await movie.save();

      const res = await request(server).get('/api/movies/' + movie._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', movie.name);     
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/movies/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no movie with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/movies/' + id);

      expect(res.status).toBe(404);
    });
  });
});