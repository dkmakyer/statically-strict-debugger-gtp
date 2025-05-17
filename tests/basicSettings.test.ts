import Light from '../ts/basicSettings';

describe('Light Class', () => {
    let light;
    let mockElement;

    beforeEach(() => {
        light = new Light();
        mockElement = document.createElement('img');
        mockElement.setAttribute('src', './assets/svgs/light_bulb_off.svg');
    });

    test('should create a notification with the correct message', () => {
        const message = 'Light switched on!';
        const notificationHTML = light.notification(message);
        
        expect(notificationHTML).toContain(message);
        expect(notificationHTML).toContain('checked.svg');
    });

    test('should display notification in the container', () => {
        document.body.innerHTML = '<div id="notification-container"></div>';
        const container = document.getElementById('notification-container');
        
        light.displayNotification('Test Notification', 'beforeend', container);
        
        expect(container?.innerHTML).toContain('Test Notification');
    });

    test('should switch light on and update the image source', () => {
        light.lightSwitchOn(mockElement);
        
        expect(mockElement.getAttribute('src')).toBe('./assets/svgs/light_bulb.svg');
        expect(mockElement.getAttribute('data-lightOn')).toBe('./assets/svgs/light_bulb_off.svg');
    });

    test('should switch light off and update the image source', () => {
        light.lightSwitchOff(mockElement);
        
        expect(mockElement.getAttribute('src')).toBe('./assets/svgs/light_bulb_off.svg');
        expect(mockElement.getAttribute('data-lightOn')).toBe('./assets/svgs/light_bulb.svg');
    });

    test('should toggle light switch state', () => {
        const roomData = {
            isLightOn: false,
            lightIntensity: 5,
        };
        light.componentsData = { room: roomData }; 

        const lightButtonElement = document.createElement('div');
        lightButtonElement.innerHTML = '<img class="light-switch" />';
        
        light.toggleLightSwitch(lightButtonElement);

        expect(roomData.isLightOn).toBe(true);
        expect(mockElement.getAttribute('src')).toBe('./assets/svgs/light_bulb.svg');
    });

    test('should handle light intensity slider correctly', () => {
        const roomData = {
            isLightOn: false,
            lightIntensity: 0,
        };
        light.componentsData = { room: roomData }; 

        light.handleLightIntensitySlider(mockElement, 5);
        
        expect(roomData.lightIntensity).toBe(5);
        expect(roomData.isLightOn).toBe(true);
    });
});
