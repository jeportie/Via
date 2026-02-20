/**
 * Via Error Handling Tests
 *
 * Tests for error scenarios and edge cases
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Via from '@Via';

import { createMockErrorResponse, createMockResponse } from './mocks.js';

describe('Via - Error Handling', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('HTTP error responses', () => {
    it('should throw error on non-2xx status', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(404));

      await expect(api.get('/pet/{petId}')).rejects.toThrow();
    });

    it('should include status code in error message', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockErrorResponse(404));

      await expect(api.get('/pet/{petId}')).rejects.toThrow(/404/);
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
