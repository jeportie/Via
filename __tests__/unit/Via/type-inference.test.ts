/**
 * Via Type Inference Tests
 *
 * These tests verify that TypeScript correctly infers types from the API schema.
 * Most of these tests validate compile-time behavior, but we include runtime
 * checks to ensure the values match the expected types.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Via from '../../../src/Via.js';

import { createMockResponse, mockPetData } from './mocks.js';

describe('Via - Type Inference', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Return type inference', () => {
    it('should infer correct return type for GET requests', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      const result = await api.get('/pet/{petId}');

      // At compile time, TypeScript knows result is { id: number, name: string, status: string }
      // At runtime, we verify the structure matches
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('status');
      expect(typeof result.id).toBe('number');
      expect(typeof result.name).toBe('string');
      expect(typeof result.status).toBe('string');
    });

    it('should infer correct return type for POST requests', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      const result = await api.post('/pet', mockPetData);

      // TypeScript infers the return type from the schema
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('status');
    });

    it('should infer correct return type for PUT requests', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      const result = await api.put('/pet/{petId}', mockPetData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('status');
    });
  });

  describe('Body type inference', () => {
    it('should accept correctly typed body for POST', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      // This compiles because body matches the schema
      await api.post('/pet', {
        id: 1,
        name: 'Fluffy',
        status: 'available',
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should accept correctly typed body for PUT', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      // This compiles because body matches the schema
      await api.put('/pet/{petId}', {
        id: 1,
        name: 'Fluffy Updated',
        status: 'sold',
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should serialize body correctly', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.post('/pet', mockPetData);

      const [, options] = (global.fetch as any).mock.calls[0];
      const sentBody = JSON.parse(options.body);

      // Verify the body was serialized correctly
      expect(sentBody).toEqual(mockPetData);
      expect(sentBody.id).toBe(mockPetData.id);
      expect(sentBody.name).toBe(mockPetData.name);
      expect(sentBody.status).toBe(mockPetData.status);
    });
  });

  describe('Endpoint type safety', () => {
    it('should only allow valid GET endpoints', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      // This endpoint supports GET in our mock schema
      await api.get('/pet/{petId}');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/pet/{petId}',
        expect.any(Object),
      );
    });

    it('should only allow valid POST endpoints', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      // This endpoint supports POST in our mock schema
      await api.post('/pet', mockPetData);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/pet',
        expect.any(Object),
      );
    });

    it('should only allow valid PUT endpoints', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      // This endpoint supports PUT in our mock schema
      await api.put('/pet/{petId}', mockPetData);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/pet/{petId}',
        expect.any(Object),
      );
    });

    it('should only allow valid DELETE endpoints', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(createMockResponse({}));

      // This endpoint supports DELETE in our mock schema
      await api.delete('/pet/{petId}');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/pet/{petId}',
        expect.any(Object),
      );
    });
  });

  describe('Base URL type safety', () => {
    it('should only allow registered base URLs', () => {
      // This compiles because the URL is in ApiRegistry
      const api = new Via('https://petstore3.swagger.io');

      expect(api).toBeInstanceOf(Via);
    });

    it('should use the correct base URL in requests', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      await api.get('/pet/{petId}');

      // Verify the full URL was constructed correctly
      const [url] = (global.fetch as any).mock.calls[0];

      expect(url).toBe('https://petstore3.swagger.io/pet/{petId}');
      expect(url).toContain('https://petstore3.swagger.io');
    });
  });

  describe('Type narrowing', () => {
    it('should maintain type information through promise chain', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      // TypeScript knows the full type through the promise
      const result = await api.get('/pet/{petId}');

      // Properties are accessible with correct types
      const petId: number = result.id;
      const petName: string = result.name;
      const petStatus: string = result.status;

      expect(petId).toBe(mockPetData.id);
      expect(petName).toBe(mockPetData.name);
      expect(petStatus).toBe(mockPetData.status);
    });

    it('should infer response structure for destructuring', async () => {
      const api = new Via('https://petstore3.swagger.io');

      (global.fetch as any).mockResolvedValueOnce(
        createMockResponse(mockPetData),
      );

      // TypeScript knows we can destructure these properties
      const { id, name, status } = await api.get('/pet/{petId}');

      expect(id).toBe(mockPetData.id);
      expect(name).toBe(mockPetData.name);
      expect(status).toBe(mockPetData.status);
    });
  });
});
