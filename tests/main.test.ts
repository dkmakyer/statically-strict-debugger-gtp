import Light from '../ts/basicSettings';
import AdvanceSettings from '../ts/advanceSettings';

describe('UI Event Handlers', () => {
    let lightController;
    let advancedSettings;
    let homepageButton;
    let homepage;
    let mainRoomsContainer;
    let advanceFeaturesContainer;
    let loader;

    beforeEach(() => {
        document.body.innerHTML = `
            <button class="entry_point">Go to Homepage</button>
            <main></main>
            <div class="application_container hidden"></div>
            <div class="advanced_features_container"></div>
            <nav class="hidden"></nav>
            <div class="loader-container"></div>
        `;

 
        homepageButton = document.querySelector(".entry_point")!;
        homepage = document.querySelector("main")!;
        mainRoomsContainer = document.querySelector(".application_container")!;
        advanceFeaturesContainer = document.querySelector(".advanced_features_container")!;
        loader = document.querySelector(".loader-container")!;

        lightController = new Light();
        advancedSettings = new AdvanceSettings();

        jest.spyOn(lightController, 'addHidden');
        jest.spyOn(lightController, 'removeHidden');
        jest.spyOn(lightController, 'setComponentElement');
        jest.spyOn(advancedSettings, 'modalPopUp');
        jest.spyOn(advancedSettings, 'closeModalPopUp');
    });

    test('should hide homepage and show loader when homepage button is clicked', () => {
        homepageButton.click();

        expect(lightController.addHidden).toHaveBeenCalledWith(homepage);
        expect(lightController.removeHidden).toHaveBeenCalledWith(loader);
    });

    test('should show main rooms container and nav after a delay', () => {
        homepageButton.click();

        jest.advanceTimersByTime(1000);

        expect(lightController.removeHidden).toHaveBeenCalledWith(mainRoomsContainer);
    });

    test('should handle light intensity slider change', () => {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.value = '5';
        mainRoomsContainer.appendChild(slider);

        const event = new Event('change');
        slider.dispatchEvent(event);

        expect(lightController.handleLightIntensitySlider).toHaveBeenCalledWith(slider, 5);
    });

});
