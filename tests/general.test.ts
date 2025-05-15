function multiply(a: number, b: number): number {
    return a * b;
  }
  
  describe('multiply()', () => {
    it('multiplies two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });
  });