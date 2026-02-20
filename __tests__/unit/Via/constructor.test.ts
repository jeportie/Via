/**
 * Via Constructor Tests
 *
 * Tests for Via class instantiation and initialization
 */

import { describe, expect, it } from 'vitest';

import Via from '@Via';

import './mocks.js'; // Import mock types

describe('Via - Constructor', () => {
  it('should be an instance of Via class', () => {
    const api = new Via('https://petstore3.swagger.io');

    expect(api).toBeInstanceOf(Via);
  });
});
