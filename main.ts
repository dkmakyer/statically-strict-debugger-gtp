// imports
import Light from './ts/basicSettings';
import AdvanceSettings from './ts/advanceSettings';

document.addEventListener("DOMContentLoaded", () => {
    // elements declarations
    const homepageButton: HTMLButtonElement | null = document.querySelector('.entry_point');
    const homepage: HTMLElement | null = document.querySelector('main');
    const mainRoomsContainer: HTMLElement | null = document.querySelector('.application_container');
    const advanceFeaturesContainer: HTMLElement | null = document.querySelector('.advanced_features_container');
    const nav: HTMLElement | null = document.querySelector('nav');
    const loader: HTMLElement | null = document.querySelector('.loader-container');

    // object creation
    const lightController: Light = new Light();
    const advancedSettings: AdvanceSettings = new AdvanceSettings();

    // global variables
    let selectedComponent: HTMLElement | null; 
    let isWifiActive: boolean = true;

    // Event handlers
    // hide homepage after button is clicked
    homepageButton?.addEventListener('click', function(e: Event) {
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

    mainRoomsContainer?.addEventListener('click', (e: MouseEvent) => {
        const selectedElement = e.target as HTMLElement;

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
            advancedSettings.modalPopUp(advanceModalElement as HTMLElement);
        }
    });

    mainRoomsContainer?.addEventListener('change', (e: Event) => {
        const slider = e.target as HTMLInputElement;
        if (!slider.classList.contains('light-intensity-slider')) return;
        const value = parseFloat(slider.value);

        lightController.handleLightIntensitySlider(slider, value);
    });

    // advance settings modal
    advanceFeaturesContainer?.addEventListener('click', (e: MouseEvent) => {
        const selectedElement = e.target as HTMLElement;

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
            } else if (selectedElement.matches('.defaultOff-cancel')) {
                advancedSettings.customizationCancelled(selectedElement, '.defaultOff');
            }
        }
    });
});
