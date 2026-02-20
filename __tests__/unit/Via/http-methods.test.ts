/**
 * Via HTTP Methods Tests
 *
 * Tests for GET, POST, PUT, DELETE operations
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Via from '@Via';

import {
  createMockResponse,
  mockPetData,
  mockUpdatedPetData,
} from './mocks.js';

describe('Via - HTTP Methods', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('get()', () => {
    it('should make a GET request to the correct URL', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.get('/pet/{petId}');

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

      expect(result).toEqual(mockPetData);
    });
  });

  describe('post()', () => {
    it('should make a POST request with body', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.post('/pet', mockPetData);

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

    it('should return response data', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      const result = await api.post('/pet', mockPetData);

      expect(result).toEqual(mockPetData);
    });
  });

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
  });

  describe('delete()', () => {
    it('should make a DELETE request', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockResponse({}));

      await api.delete('/pet/{petId}');

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
