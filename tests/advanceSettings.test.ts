import AdvanceSettings from '../ts/advanceSettings';

describe('AdvanceSettings', () => {
  let advanceSettings: AdvanceSettings;

  beforeEach(() => {
    advanceSettings = new AdvanceSettings();
  });


  describe('capFirstLetter', () => {
    it('should capitalize first letter', () => {
      expect(advanceSettings.capFirstLetter('test')).toBe('Test');
    });

    it('should handle empty string', () => {
      expect(advanceSettings.capFirstLetter('')).toBe('');
    });
  });

  describe('getObjectDetails', () => {
    it('should return the instance itself', () => {
      expect(advanceSettings.getObjectDetails()).toBe(advanceSettings);
    });
  });

  describe('formatTime', () => {
    it('should return Date object for valid time', () => {
      const result = advanceSettings.formatTime('12:30');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(12);
      expect(result?.getMinutes()).toBe(30);
    });

    it('should return null for invalid format', () => {
      expect(advanceSettings.formatTime('invalid')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(advanceSettings.formatTime('')).toBeNull();
    });
  });

  describe('formatTimeString', () => {
    it('should format valid time string', () => {
      expect(advanceSettings.formatTimeString('9:5')).toBe('09:05');
    });

    it('should return empty string for invalid time', () => {
      expect(advanceSettings.formatTimeString('invalid')).toBe('');
    });
  });

  describe('timeDifference', () => {
    it('should return positive number for future time', () => {
      const future = new Date();
      future.setHours(future.getHours() + 1);
      const futureTime = `${future.getHours()}:${future.getMinutes()}`;
      
      const result = advanceSettings.timeDifference(futureTime);
      expect(result).toBeGreaterThan(0);
    });

    it('should return null for invalid time', () => {
      expect(advanceSettings.timeDifference('invalid')).toBeNull();
    });
  });
});