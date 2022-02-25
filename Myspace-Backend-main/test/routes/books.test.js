const request = require('supertest');
const { Books } = require('../../models/books');
const mongoose = require('mongoose');

let server;

describe('/api/books', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Books.remove({});
  });

  describe('GET /', () => {
    it('should return all books', async () => {
      const books = [
        { name: 'book1' },
        { name: 'book2' },
      ];
      
      await Books.collection.insertMany(books);

      const res = await request(server).get('/api/books');
      
      expect(res.status).toBe(200);
      expect(res.body.some(g => g.name === 'book1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'book2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a book if valid id is passed', async () => {
      const book = new Books({ name: 'book1' });
      await book.save();

      const res = await request(server).get('/api/books/' + book._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', book.name);     
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/books/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no book with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/books/' + id);

      expect(res.status).toBe(404);
    });
  });
});