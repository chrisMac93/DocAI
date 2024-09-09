const { scanCodebase } = require('../src/scan');

test('scanCodebase should return changes when they are detected', () => {
  const result = scanCodebase();
  expect(result).toContain('Detected changes in the codebase');
});