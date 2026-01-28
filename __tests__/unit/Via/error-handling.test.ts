/**
 * Via Error Handling Tests
 *
 * Tests for error scenarios and edge cases
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Via from '../../../src/Via.js';

import { createMockErrorResponse, createMockResponse } from './mocks.js';

describe('Via - Error Handling', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('HTTP error responses', () => {
    it('should throw error on 404 Not Found', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(404));

      // rejects.toThrow() checks that the promise rejects with an error
      await expect(api.get('/pet/{petId}')).rejects.toThrow();
    });

    it('should throw error on 400 Bad Request', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(400));

      await expect(
        api.post('/pet', { id: 1, name: 'Fluffy', status: 'available' }),
      ).rejects.toThrow();
    });

    it('should throw error on 500 Internal Server Error', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(500));

      await expect(api.get('/pet/{petId}')).rejects.toThrow();
    });

    it('should include status code in error message', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(404));

      // Check that error message contains the status code
      await expect(api.get('/pet/{petId}')).rejects.toThrow(/404/);
    });

    it('should throw error for all non-2xx status codes', async () => {
      const api = new Via('https://petstore3.swagger.io');
      const errorCodes = [400, 401, 403, 404, 500, 502, 503];

      const testPromises = errorCodes.map((statusCode) => {
        (global.fetch as any).mockResolvedValueOnce(
          createMockErrorResponse(statusCode),
        );

        return expect(api.get('/pet/{petId}')).rejects.toThrow();
      });

      await Promise.all(testPromises);
    });
  });

  describe('Network errors', () => {
    it('should handle network failure', async () => {
      const api = new Via('https://petstore3.swagger.io');

      // Simulate network failure
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(api.get('/pet/{petId}')).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockRejectedValueOnce(new Error('Request timeout'));

      await expect(api.get('/pet/{petId}')).rejects.toThrow('Request timeout');
    });

    it('should handle DNS resolution errors', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockRejectedValueOnce(
        new Error('getaddrinfo ENOTFOUND'),
      );

      await expect(api.get('/pet/{petId}')).rejects.toThrow(/ENOTFOUND/);
    });
  });

  describe('Response parsing errors', () => {
    it('should handle invalid JSON in response', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Unexpected token in JSON');
        },
      });

      await expect(api.get('/pet/{petId}')).rejects.toThrow(
        'Unexpected token in JSON',
      );
    });

    it('should handle empty response body when JSON expected', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected end of JSON input');
        },
      });

      await expect(api.get('/pet/{petId}')).rejects.toThrow();
    });
  });

  describe('Error handling for different HTTP methods', () => {
    it('should handle GET request errors', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(404));

      await expect(api.get('/pet/{petId}')).rejects.toThrow();
    });

    it('should handle POST request errors', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(400));

      await expect(
        api.post('/pet', { id: 1, name: 'Fluffy', status: 'available' }),
      ).rejects.toThrow();
    });

    it('should handle PUT request errors', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(403));

      await expect(
        api.put('/pet/{petId}', { id: 1, name: 'Fluffy', status: 'available' }),
      ).rejects.toThrow();
    });

    it('should handle DELETE request errors', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(404));

      await expect(api.delete('/pet/{petId}')).rejects.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle successful response with null body', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockResponse(null));

      const result = await api.get('/pet/{petId}');

      expect(result).toBeNull();
    });

    it('should handle successful response with empty object', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockResponse({}));

      const result = await api.get('/pet/{petId}');

      expect(result).toEqual({});
    });

    it('should handle successful response with array', async () => {
      const api = new Via('https://petstore3.swagger.io');
      const arrayData = [
        { id: 1, name: 'Fluffy' },
        { id: 2, name: 'Spot' },
      ];

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(arrayData),
      );

      const result = await api.get('/pet/{petId}');

      expect(result).toEqual(arrayData);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
