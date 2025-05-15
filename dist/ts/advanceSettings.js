'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicSettings_1 = __importDefault(require("./basicSettings"));
const chart_js_1 = require("chart.js");
class AdvanceSettings extends basicSettings_1.default {
    constructor() {
        super();
    }
    markup(component) {
        const { name, numOfLights, autoOn, autoOff } = component;
        return `
        <div class="advanced_features">
            <h3>Advanced features</h3>
            <section class="component_summary">
                <div>
                    <p class="component_name">${this.capFirstLetter(name)}</p>
                    <p class="number_of_lights">${numOfLights}</p>
                </div>
                <div>
                    <p class="auto_on">
                        <span>Automatic turn on:</span>
                        <span>${autoOn}</span>
                    </p>
                    <p class="auto_off">
                        <span>Automatic turn off:</span>
                        <span>${autoOff}</span>
                    </p>
                    <p class="countdown-display"></p>
                </div>
            </section>
            <section class="customization">
                <div class="edit">
                    <p>Customize</p>
                    <button class="customization-btn">
                        <img src="./assets/svgs/edit.svg" alt="customize settings svg icon">
                    </button>
                </div>
                <section class="customization-details hidden">
                    <div>
                        <h4>Automatic on/off settings</h4>
                        <div class="defaultOn">
                            <label for="">Turn on</label>
                            <input type="time" name="autoOnTime" id="autoOnTime" value="${this.formatTimeString(autoOn)}">
                            <div>
                                <button class="defaultOn-okay">Okay</button>
                                <button class="defaultOn-cancel">Cancel</button>
                            </div>
                        </div>
                        <div class="defaultOff">
                            <label for="">Go off</label>
                            <input type="time" name="autoOffTime" id="autoOffTime" value="${this.formatTimeString(autoOff)}">
                            <div>
                                <button class="defaultOff-okay">Okay</button>
                                <button class="defaultOff-cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="summary">
                    <h3>Summary</h3>
                    <div class="chart-container">
                        <canvas id="myChart"></canvas>
                    </div>
                </section>
            </section>
            <button class="close-btn">
                <img src="./assets/svgs/close.svg" alt="close button svg icon">
            </button>
        </div>
        `;
    }
    analyticsUsage(data) {
        const ctx = this.selector('#myChart');
        if (!ctx)
            return;
        const config = {
            type: 'line',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
                datasets: [{
                        label: 'Hours of usage',
                        data: data,
                        borderWidth: 1
                    }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
        new chart_js_1.Chart(ctx, config);
    }
    modalPopUp(element) {
        const selectedRoom = this.getSelectedComponentName(element);
        if (!selectedRoom)
            return;
        const componentData = this.getComponent(selectedRoom);
        if (!componentData)
            return;
        const parentElement = this.selector('.advanced_features_container');
        if (!parentElement)
            return;
        this.removeHidden(parentElement);
        this.renderHTML(this.markup(componentData), 'afterbegin', parentElement);
        this.analyticsUsage(componentData.usage);
    }
    displayCustomization(selectedElement) {
        const element = this.closestSelector(selectedElement, '.customization', '.customization-details');
        if (element) {
            this.toggleHidden(element);
        }
    }
    closeModalPopUp() {
        const parentElement = this.selector('.advanced_features_container');
        if (!parentElement)
            return;
        const childElement = this.selector('.advanced_features');
        if (!childElement)
            return;
        childElement.remove();
        this.addHidden(parentElement);
    }
    customizationCancelled(selectedElement, parentSelectorIdentifier) {
        const element = this.closestSelector(selectedElement, parentSelectorIdentifier, 'input');
        if (element) {
            element.value = '';
        }
    }
    customizeAutomaticOnPreset(selectedElement) {
        const element = this.closestSelector(selectedElement, '.defaultOn', 'input');
        if (!element || !element.value)
            return;
        const component = this.getComponentData(element, '.advanced_features', '.component_name');
        if (!component)
            return;
        component.autoOn = element.value;
        element.value = '';
        const spanElement = this.selector('.auto_on > span:last-child');
        if (spanElement) {
            this.updateMarkupValue(spanElement, component.autoOn);
        }
        this.setComponentElement(component);
        this.automateLight(component.autoOn, component);
    }
    customizeAutomaticOffPreset(selectedElement) {
        const element = this.closestSelector(selectedElement, '.defaultOff', 'input');
        if (!element || !element.value)
            return;
        const component = this.getComponentData(element, '.advanced_features', '.component_name');
        if (!component)
            return;
        component.autoOff = element.value;
        element.value = '';
        const spanElement = this.selector('.auto_off > span:last-child');
        if (spanElement) {
            this.updateMarkupValue(spanElement, component.autoOff);
        }
        this.setComponentElement(component);
        this.automateLight(component.autoOff, component);
    }
    getSelectedComponent(componentName) {
        if (!componentName)
            return undefined;
        return super.getComponent(componentName);
    }
    getSelectedSettings(componentName) {
        const component = this.getSelectedComponent(componentName);
        return component ? this.markup(component) : '';
    }
    setNewData(component, key, data) {
        const selectedComponent = this.getSelectedComponent(component);
        if (selectedComponent) {
            selectedComponent[key] = data;
        }
    }
    capFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    getObjectDetails() {
        return this;
    }
    formatTime(time) {
        if (!time || !time.includes(':'))
            return null;
        const [hour, min] = time.split(':').map(Number);
        if (isNaN(hour) || isNaN(min))
            return null;
        const dailyAlarmTime = new Date();
        dailyAlarmTime.setHours(hour);
        dailyAlarmTime.setMinutes(min);
        dailyAlarmTime.setSeconds(0);
        dailyAlarmTime.setMilliseconds(0);
        return dailyAlarmTime;
    }
    formatTimeString(time) {
        const date = this.formatTime(time);
        if (!date)
            return '';
        const hrs = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');
        return `${hrs}:${mins}`;
    }
    timeDifference(selectedTime) {
        const now = new Date();
        const setTime = this.formatTime(selectedTime);
        if (!setTime)
            return null;
        return setTime.getTime() - now.getTime();
    }
    async timer(timeString, component) {
        const diff = this.timeDifference(timeString);
        if (diff === null || diff <= 0) {
            console.warn("Scheduled time has already passed.");
            return;
        }
        const countdownEl = this.selector('.countdown-display');
        const intervalId = setInterval(() => {
            const remainingTime = this.timeDifference(timeString);
            if (remainingTime === null || remainingTime <= 0) {
                clearInterval(intervalId);
                if (component.element) {
                    this.toggleLightSwitch(component.element);
                }
                if (countdownEl)
                    countdownEl.textContent = "Time's up!";
            }
            else {
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                if (countdownEl)
                    countdownEl.textContent = `Time left: ${hours}h ${minutes}m ${seconds}s`;
            }
        }, 1000);
        return new Promise((resolve) => {
            setTimeout(() => {
                clearInterval(intervalId);
                if (component.element) {
                    this.toggleLightSwitch(component.element);
                }
                resolve();
            }, diff);
        });
    }
    async automateLight(time, component) {
        return await this.timer(time, component);
    }
}
exports.default = AdvanceSettings;
