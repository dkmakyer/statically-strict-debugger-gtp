'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = __importDefault(require("./general"));
class Light extends general_1.default {
    constructor() {
        super();
    }
    notification(message) {
        return `
            <div class="notification">
                <div>
                    <img src="./assets/svgs/checked.svg" alt="checked svg icon on notifications" >
                </div>
                <p>${message}</p>
            </div>
        `;
    }
    lightSwitchOn(lightButtonElement) {
        lightButtonElement.setAttribute('src', './assets/svgs/light_bulb.svg');
        lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb_off.svg');
    }
    lightSwitchOff(lightButtonElement) {
        lightButtonElement.setAttribute('src', './assets/svgs/light_bulb_off.svg');
        lightButtonElement.setAttribute('data-lightOn', './assets/svgs/light_bulb.svg');
    }
    lightComponentSelectors(lightButtonElement) {
        const room = this.getSelectedComponentName(lightButtonElement);
        const componentData = this.getComponent(room || '');
        const childElement = lightButtonElement.firstElementChild;
        const background = this.closestSelector(lightButtonElement, '.rooms', 'img');
        return { room, componentData, childElement, background };
    }
    toggleLightSwitch(lightButtonElement) {
        const { componentData: component, childElement, background } = this.lightComponentSelectors(lightButtonElement);
        const slider = this.closestSelector(lightButtonElement, '.rooms', '#light_intensity');
        if (!component || !slider)
            return;
        component.isLightOn = !component.isLightOn;
        if (component.isLightOn) {
            this.lightSwitchOn(lightButtonElement);
            const lightIntensity = component.lightIntensity / 10;
            this.handleLightIntensity(background, lightIntensity.toString());
            slider.value = component.lightIntensity.toString();
            slider.addEventListener('input', (event) => {
                const intensity = parseInt(event.target.value, 10);
                this.handleLightIntensitySlider(slider, intensity);
            });
        }
        else {
            this.lightSwitchOff(lightButtonElement);
            this.handleLightIntensity(background, '0');
            slider.value = '0';
        }
    }
    handleLightIntensitySlider(element, intensity) {
        const { componentData, background } = this.lightComponentSelectors(element);
        if (typeof intensity !== 'number' || isNaN(intensity))
            return;
        componentData.lightIntensity = intensity;
        const lightSwitch = this.closestSelector(element, '.rooms', '.light-switch');
        componentData.isLightOn = intensity > 0;
        this.sliderLight(componentData.isLightOn, lightSwitch);
        const brightness = componentData.lightIntensity / 10;
        this.handleLightIntensity(background, brightness.toString());
    }
    sliderLight(isLightOn, lightButtonElement) {
        const { componentData: component, childElement, background } = this.lightComponentSelectors(lightButtonElement);
        if (!component)
            return;
        component.isLightOn = isLightOn;
        if (isLightOn) {
            this.lightSwitchOn(childElement);
            const lightIntensity = component.lightIntensity / 10;
            this.handleLightIntensity(background, lightIntensity.toString());
        }
        else {
            this.lightSwitchOff(childElement);
            this.handleLightIntensity(background, "0");
        }
    }
}
exports.default = Light;
