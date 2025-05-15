'use strict';

import General from "./general";
import Light from './basicSettings';
import { Chart, ChartConfiguration } from 'chart.js';

interface BaseComponent {
    name: string;
    numOfLights: number;
    autoOn: string;
    autoOff: string;
    lightIntensity: number;
    isLightOn: boolean;
}

interface Component extends BaseComponent {
    usage: number[];
    element?: HTMLElement;
}

class AdvanceSettings extends Light {
    constructor() {
        super();
    }

    private markup(component: Component): string {
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

    private analyticsUsage(data: number[]): void {
        const ctx = this.selector('#myChart') as HTMLCanvasElement;
        if (!ctx) return;

        const config: ChartConfiguration<'line'> = {
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

        new Chart(ctx, config);
    }

 
    modalPopUp(element: HTMLElement): void {
        const selectedRoom = this.getSelectedComponentName(element);
        if (!selectedRoom) return;
        
        const componentData = this.getComponent(selectedRoom) as Component | undefined;
        if (!componentData) return;
        
        const parentElement = this.selector('.advanced_features_container') as HTMLElement;
        if (!parentElement) return;
        
        this.removeHidden(parentElement);
        this.renderHTML(this.markup(componentData), 'afterbegin', parentElement);
        this.analyticsUsage(componentData.usage);
    }

    displayCustomization(selectedElement: HTMLElement): void {
        const element = this.closestSelector(selectedElement, '.customization', '.customization-details');
        if (element) {
            this.toggleHidden(element);
        }
    }

    closeModalPopUp(): void {
        const parentElement = this.selector('.advanced_features_container') as HTMLElement;
        if (!parentElement) return;
        
        const childElement = this.selector('.advanced_features') as HTMLElement;
        if (!childElement) return;

        childElement.remove();
        this.addHidden(parentElement);
    }

    customizationCancelled(selectedElement: HTMLElement, parentSelectorIdentifier: string): void {
        const element = this.closestSelector(selectedElement, parentSelectorIdentifier, 'input') as HTMLInputElement | null;
        if (element) {
            element.value = '';
        }
    }

    customizeAutomaticOnPreset(selectedElement: HTMLElement): void {
        const element = this.closestSelector(selectedElement, '.defaultOn', 'input') as HTMLInputElement | null;
        if (!element || !element.value) return;
        
        const component = this.getComponentData(element, '.advanced_features', '.component_name') as Component;
        if (!component) return;
        
        component.autoOn = element.value;
        element.value = '';

        const spanElement = this.selector('.auto_on > span:last-child') as HTMLElement;
        if (spanElement) {
            this.updateMarkupValue(spanElement, component.autoOn);
        }

        this.setComponentElement(component);
        this.automateLight(component.autoOn, component);
    }

    customizeAutomaticOffPreset(selectedElement: HTMLElement): void {
        const element = this.closestSelector(selectedElement, '.defaultOff', 'input') as HTMLInputElement | null;
        if (!element || !element.value) return;
        
        const component = this.getComponentData(element, '.advanced_features', '.component_name') as Component;
        if (!component) return;
        
        component.autoOff = element.value;
        element.value = '';

        const spanElement = this.selector('.auto_off > span:last-child') as HTMLElement;
        if (spanElement) {
            this.updateMarkupValue(spanElement, component.autoOff);
        }

        this.setComponentElement(component);
        this.automateLight(component.autoOff, component);
    }

    getSelectedComponent(componentName: string): Component | undefined {
        if (!componentName) return undefined;
        return super.getComponent(componentName) as Component | undefined;
    }

    getSelectedSettings(componentName: string): string {
        const component = this.getSelectedComponent(componentName);
        return component ? this.markup(component) : '';
    }

    setNewData(component: string, key: keyof Component, data: string | number | number[]): void {
        const selectedComponent = this.getSelectedComponent(component);
        if (selectedComponent) {
            (selectedComponent[key] as typeof data) = data;
        }
    }

    capFirstLetter(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    getObjectDetails(): this {
        return this;
    }

    formatTime(time: string): Date | null {
        if (!time || !time.includes(':')) return null;
        const [hour, min] = time.split(':').map(Number);

        if (isNaN(hour) || isNaN(min)) return null;

        const dailyAlarmTime = new Date();
        dailyAlarmTime.setHours(hour); 
        dailyAlarmTime.setMinutes(min);
        dailyAlarmTime.setSeconds(0);
        dailyAlarmTime.setMilliseconds(0);
        
        return dailyAlarmTime;
    }

    formatTimeString(time: string): string {
        const date = this.formatTime(time);
        if (!date) return '';
        const hrs = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');
        return `${hrs}:${mins}`;
    }

    timeDifference(selectedTime: string): number | null {
        const now = new Date();
        const setTime = this.formatTime(selectedTime);
        if (!setTime) return null;
        return setTime.getTime() - now.getTime();
    }

    private async timer(timeString: string, component: Component): Promise<void> {
        const diff = this.timeDifference(timeString);
        if (diff === null || diff <= 0) {
            console.warn("Scheduled time has already passed.");
            return;
        }

        const countdownEl = this.selector('.countdown-display') as HTMLElement;
        const intervalId = setInterval(() => {
            const remainingTime = this.timeDifference(timeString);
            if (remainingTime === null || remainingTime <= 0) {
                clearInterval(intervalId);
                if (component.element) {
                    this.toggleLightSwitch(component.element);
                }
                if (countdownEl) countdownEl.textContent = "Time's up!";
            } else {
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                if (countdownEl) countdownEl.textContent = `Time left: ${hours}h ${minutes}m ${seconds}s`;
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

    async automateLight(time: string, component: Component): Promise<void> {
        return await this.timer(time, component);
    }
}

export default AdvanceSettings;
