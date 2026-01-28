/**
 * Via Constructor Tests
 *
 * Tests for Via class instantiation and initialization
 */

import { describe, expect, it } from 'vitest';

import Via from '../../../src/Via.js';

import './mocks.js'; // Import mock types

describe('Via - Constructor', () => {
  it('should create an instance with a base URL', () => {
    const api = new Via('https://petstore3.swagger.io');

    // toBeDefined() checks that the value is not undefined
    expect(api).toBeDefined();
  });

  it('should be an instance of Via class', () => {
    const api = new Via('https://petstore3.swagger.io');

    // toBeInstanceOf() checks the value is an instance of the class
    expect(api).toBeInstanceOf(Via);
  });

  it('should accept registered base URL from ApiRegistry', () => {
    // This tests that module augmentation works correctly
    // TypeScript will error at compile time if the URL is not registered
    const api = new Via('https://petstore3.swagger.io');

    expect(api).toBeDefined();
  });
});
