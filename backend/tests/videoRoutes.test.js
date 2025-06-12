const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models/videoModel');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed-token'),
  verify: jest.fn(() => ({ id: 1, role: 'speaker' }))
}));

const VideoModel = require('../src/models/videoModel');

describe('POST /api/videos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a video with videoUrl', async () => {
    VideoModel.createVideo.mockResolvedValue({ id: 1, title: 'Test' });

    const res = await request(app)
      .post('/api/videos')
      .set('Authorization', 'Bearer signed-token')
      .send({ title: 'Test', videoUrl: 'http://example.com' });

    expect(res.statusCode).toBe(201);
    expect(VideoModel.createVideo).toHaveBeenCalled();
  });

  it('returns 400 when title missing', async () => {
    const res = await request(app)
      .post('/api/videos')
      .set('Authorization', 'Bearer signed-token')
      .send({ videoUrl: 'http://example.com' });

    expect(res.statusCode).toBe(400);
  });
});
