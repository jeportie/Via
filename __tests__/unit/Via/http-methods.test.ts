/**
 * Via HTTP Methods Tests
 *
 * Tests for GET, POST, PUT, DELETE operations
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Via from '../../../src/Via.js';

import {
  createMockResponse,
  mockPetData,
  mockUpdatedPetData,
} from './mocks.js';

describe('Via - HTTP Methods', () => {
  /**
   * Setup: Mock global fetch before each test
   */
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  /**
   * Teardown: Restore all mocks after each test
   */
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * GET Method Tests
   */
  describe('get()', () => {
    it('should make a GET request to the correct URL', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.get('/pet/{petId}');

      // Verify fetch was called with correct URL and options
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/pet/{petId}',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );
    });

    it('should return parsed JSON response', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      const result = await api.get('/pet/{petId}');

      // toEqual() does deep equality check (compares object contents)
      expect(result).toEqual(mockPetData);
    });

    it('should include Accept header', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.get('/pet/{petId}');

      const [, options] = (global.fetch as any).mock.calls[0];

      expect(options.headers).toHaveProperty('Accept', 'application/json');
    });
  });

  /**
   * POST Method Tests
   */
  describe('post()', () => {
    it('should make a POST request with body', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.post('/pet', mockPetData);

      // Verify fetch was called with POST method and body
      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/pet',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockPetData),
        },
      );
    });

    it('should serialize body as JSON', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.post('/pet', mockPetData);

      const [, options] = (global.fetch as any).mock.calls[0];

      expect(options.body).toBe(JSON.stringify(mockPetData));
    });

    it('should include Content-Type header', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.post('/pet', mockPetData);

      const [, options] = (global.fetch as any).mock.calls[0];

      expect(options.headers).toHaveProperty(
        'Content-Type',
        'application/json',
      );
    });

    it('should return response data', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      const result = await api.post('/pet', mockPetData);

      expect(result).toEqual(mockPetData);
    });
  });

  /**
   * PUT Method Tests
   */
  describe('put()', () => {
    it('should make a PUT request with body', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockUpdatedPetData),
      );

      await api.put('/pet/{petId}', mockUpdatedPetData);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/pet/{petId}',
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockUpdatedPetData),
        },
      );
    });

    it('should return updated data', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockUpdatedPetData),
      );

      const result = await api.put('/pet/{petId}', mockUpdatedPetData);

      expect(result).toEqual(mockUpdatedPetData);
    });

    it('should include both Accept and Content-Type headers', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockUpdatedPetData),
      );

      await api.put('/pet/{petId}', mockUpdatedPetData);

      const [, options] = (global.fetch as any).mock.calls[0];

      expect(options.headers).toHaveProperty('Accept', 'application/json');
      expect(options.headers).toHaveProperty(
        'Content-Type',
        'application/json',
      );
    });
  });

  /**
   * DELETE Method Tests
   */
  describe('delete()', () => {
    it('should make a DELETE request', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockResponse({}));

      await api.delete('/pet/{petId}');

      // DELETE requests typically don't have a body
      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/pet/{petId}',
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
        },
      );
    });

    it('should not include Content-Type header', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockResponse({}));

      await api.delete('/pet/{petId}');

      const [, options] = (global.fetch as any).mock.calls[0];

      expect(options.headers).not.toHaveProperty('Content-Type');
    });

    it('should not include a body', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockResponse({}));

      await api.delete('/pet/{petId}');

      const [, options] = (global.fetch as any).mock.calls[0];

      expect(options.body).toBeUndefined();
    });

    it('should return response data', async () => {
      const api = new Via('https://petstore3.swagger.io');
      const emptyResponse = {};

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(emptyResponse),
      );

      const result = await api.delete('/pet/{petId}');

      expect(result).toEqual(emptyResponse);
    });
  });
});
