describe('Hello World', () => {
  it('should return hello world', () => {
    const { getHelloWorld } = require('../helloWorld');
    
    const result = getHelloWorld();
    
    expect(result).toBe('hello world');
  });
});
