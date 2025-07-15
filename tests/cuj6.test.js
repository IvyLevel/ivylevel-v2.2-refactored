// tests/cuj6.test.js - Run with npm test
describe('CUJ 6: Coach Onboarding', () => {
  test('Generates personalized path', async () => {
    const response = await fetch('http://localhost:8000/provision', {
      method: 'POST',
      body: JSON.stringify({ profile: { gpa: 3.8 } }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    expect(data).toHaveProperty('path', 'custom_10_days');
  });
}); 