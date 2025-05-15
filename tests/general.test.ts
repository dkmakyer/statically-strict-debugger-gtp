import General from '../ts/general';

describe('General', () => {
  let general: General;

  beforeEach(() => {
    general = new General();
  });

  describe('notification', () => {
    it('should return HTML string with message', () => {
      const message = 'Test message';
      const result = general.notification(message);
      expect(result).toContain(message);
      expect(typeof result).toBe('string');
    });
  });

  describe('formatTextToClassName', () => {
    it('should convert spaces to underscores', () => {
      const name = 'guest room';
      const result = general.formatTextToClassName(name);
      expect(result).toBe('guest_room');
    });
  });

  describe('getComponent', () => {
    it('should return correct lightIntensity for kitchen', () => {
      const component = general.getComponent('kitchen');
      expect(component.lightIntensity).toBe(5);
    });
  });

  describe('isLightOn', () => {
    it('should initialize isLightOn to false', () => {
      expect(general.isLightOn).toBe(false);
    });
  });

  describe('getWifi', () => {
    it('should return all available wifi connections', () => {
      const result = general.getWifi();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
    });
  });
});
