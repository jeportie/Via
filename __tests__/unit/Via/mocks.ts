/**
 * Shared Mock Types for Via Tests
 *
 * This file contains the mock ApiRegistry augmentation used across all Via tests.
 * We use a simplified inline structure (not operations pattern) for easier testing.
 */

declare module '../../../src/types.js' {
  interface ApiRegistry {
    'https://petstore3.swagger.io': {
      '/pet': {
        post: {
          requestBody: {
            content: {
              'application/json': {
                id: number;
                name: string;
                status: string;
              };
            };
          };
          responses: {
            200: {
              content: {
                'application/json': {
                  id: number;
                  name: string;
                  status: string;
                };
              };
            };
          };
        };
      };
      '/pet/{petId}': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  id: number;
                  name: string;
                  status: string;
                };
              };
            };
          };
        };
        put: {
          requestBody: {
            content: {
              'application/json': {
                id: number;
                name: string;
                status: string;
              };
            };
          };
          responses: {
            200: {
              content: {
                'application/json': {
                  id: number;
                  name: string;
                  status: string;
                };
              };
            };
          };
        };
        delete: {
          responses: {
            200: {
              content: {
                'application/json': never;
              };
            };
          };
        };
      };
    };
  }
}

/**
 * Mock data for tests
 */
export const mockPetData = {
  id: 1,
  name: 'Fluffy',
  status: 'available',
};

export const mockUpdatedPetData = {
  id: 1,
  name: 'Fluffy Updated',
  status: 'sold',
};

/**
 * Helper to create a successful fetch response mock
 */
export function createMockResponse(
  data: unknown,
  status = 200,
): { ok: boolean; status: number; json: () => Promise<unknown> } {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

/**
 * Helper to create a failed fetch response mock
 */
export function createMockErrorResponse(status: number): {
  ok: boolean;
  status: number;
  json: () => Promise<Record<string, never>>;
} {
  return {
    ok: false,
    status,
    json: async () => ({}),
  };
}
