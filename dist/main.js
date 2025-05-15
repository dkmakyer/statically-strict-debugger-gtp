"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const basicSettings_1 = __importDefault(require("./ts/basicSettings"));
const advanceSettings_1 = __importDefault(require("./ts/advanceSettings"));
document.addEventListener("DOMContentLoaded", () => {
    // elements declarations
    const homepageButton = document.querySelector('.entry_point');
    const homepage = document.querySelector('main');
    const mainRoomsContainer = document.querySelector('.application_container');
    const advanceFeaturesContainer = document.querySelector('.advanced_features_container');
    const nav = document.querySelector('nav');
    const loader = document.querySelector('.loader-container');
    // object creation
    const lightController = new basicSettings_1.default();
    const advancedSettings = new advanceSettings_1.default();
    // global variables
    let selectedComponent;
    let isWifiActive = true;
    // Event handlers
    // hide homepage after button is clicked
    homepageButton?.addEventListener('click', function (e) {
        console.log("Homepage button clicked");
        if (!homepage || !loader || !mainRoomsContainer || !nav) {
            console.error("One or more elements are not found");
            return;
        }
        lightController.addHidden(homepage);
        lightController.removeHidden(loader);
        setTimeout(() => {
            lightController.removeHidden(mainRoomsContainer);
            lightController.removeHidden(nav);
            console.log("Main rooms container and nav are now visible");
        }, 1000);
    });
    mainRoomsContainer?.addEventListener('click', (e) => {
        const selectedElement = e.target;
        // when click occurs on light switch
        const lightSwitchElement = selectedElement.closest(".light-switch");
        if (lightSwitchElement) {
            const basicSettingsButtons = selectedElement.closest(".basic_settings_buttons");
            if (basicSettingsButtons) {
                const lightSwitch = basicSettingsButtons.firstElementChild;
                if (lightSwitch instanceof HTMLElement) {
                    lightController.toggleLightSwitch(lightSwitch);
                }
            }
            return;
        }
        // when click occurs on advance modal
        const advanceModalElement = selectedElement.closest('.advance-settings_modal');
        if (advanceModalElement) {
            advancedSettings.modalPopUp(advanceModalElement);
        }
    });
    mainRoomsContainer?.addEventListener('change', (e) => {
        const slider = e.target;
        if (!slider.classList.contains('light-intensity-slider'))
            return;
        const value = parseFloat(slider.value);
        lightController.handleLightIntensitySlider(slider, value);
    });
    // advance settings modal
    advanceFeaturesContainer?.addEventListener('click', (e) => {
        const selectedElement = e.target;
        if (selectedElement.closest('.close-btn')) {
            advancedSettings.closeModalPopUp();
        }
        // display customization markup
        if (selectedElement.closest('.customization-btn')) {
            advancedSettings.displayCustomization(selectedElement);
        }
        // set light on time customization
        if (selectedElement.matches('.defaultOn-okay')) {
            advancedSettings.customizeAutomaticOnPreset(selectedElement);
        }
        // set light off time customization
        if (selectedElement.matches('.defaultOff-okay')) {
            advancedSettings.customizeAutomaticOffPreset(selectedElement);
        }
        // cancel light time customization
        if (selectedElement.textContent?.includes("Cancel")) {
            if (selectedElement.matches('.defaultOn-cancel')) {
                advancedSettings.customizationCancelled(selectedElement, '.defaultOn');
            }
            else if (selectedElement.matches('.defaultOff-cancel')) {
                advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
            }
        }
    });
});
