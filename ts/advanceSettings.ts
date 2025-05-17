"use strict";
import { Chart } from "chart.js";

export interface ComponentInterface {
	name: string;
	numOfLights: number;
	autoOn: string;
	autoOff: string;
}

import General from "./general.js";
import Light from "./basicSettings";

class AdvanceSettings extends Light {
	constructor() {
		super();
	}

	#markup(component: ComponentInterface) {
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
                            <input type="time" name="autoOnTime" id="autoOnTime">
                            <div>
                                <button class="defaultOn-okay">Okay</button>
                                <button class="defaultOn-cancel">Cancel</button>
                            </div>
                        </div>
                        <div class="defaultOff">
                            <label for="">Go off</label>
                            <input type="time" name="autoOffTime" id="autoOffTime">
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
                <button class="close-btn">
                    <img src="./assets/svgs/close.svg" alt="close button svg icon">
                </button>
            </section>
            <button class="close-btn">
                <img src="./assets/svgs/close.svg" alt="close button svg icon">
            </button>
        </div>
        `;
	}

	#analyticsUsage(data: number[]) {
		const ctx = this.selector("#myChart") as HTMLCanvasElement;
		new Chart(ctx, {
			type: "line",
			data: {
				labels: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
				datasets: [
					{
						label: "Hours of usage",
						data: data,
						borderWidth: 1,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
	}

	modalPopUp(element: HTMLElement) {
		const selectedRoom = this.getSelectedComponentName(element)!;
		const componentData = this.getComponent(selectedRoom);
		const parent = this.selector(".advanced_features_container") as HTMLElement;
		this.removeHidden(parent);
		this.renderHTML(this.#markup(componentData), "afterbegin", parent);
		this.#analyticsUsage(componentData["usage"]);
	}

	displayCustomization(selectedElement: HTMLElement) {
		const el = this.closestSelector(selectedElement, ".customization", ".customization-details") as HTMLElement;
		this.toggleHidden(el);
	}

	closeModalPopUp() {
		const parent = this.selector(".advanced_features_container") as HTMLElement;
		const child = this.selector(".advanced_features") as HTMLElement;
		child.remove();
		this.addHidden(parent);
	}

	customizationCancelled(selectedElement: HTMLElement, parentSelectorIdentifier: string) {
		const input = this.closestSelector(selectedElement, parentSelectorIdentifier, "input") as HTMLInputElement;
		input.value = "";
	}

	customizeAutomaticOnPreset(selectedElement: HTMLElement) {
		const input = this.closestSelector(selectedElement, ".defaultOn", "input") as HTMLInputElement;
		const { value } = input;
		if (!value) return;

		const component = this.getComponentData(input, ".advanced_features", ".component_name");
		if(component){
            component.autoOn = value;
        }
		input.value = "";

		const display = this.selector(".auto_on > span:last-child") as HTMLElement;
            if(component){
                this.updateMarkupValue(display, component.autoOn);
                this.setComponentElement(component);
                this.automateLight(component.autoOn, component);
            }
	}

	customizeAutomaticOffPreset(selectedElement: HTMLElement) {
		const input = this.closestSelector(selectedElement, ".defaultOff", "input") as HTMLInputElement;
		const { value } = input;
		if (!value) return;

		const component = this.getComponentData(input, ".advanced_features", ".component_name");
		if(component){
            component.autoOff = value;
        }
		input.value = "";

		const display = this.selector(".auto_off > span:last-child") as HTMLElement;

		if (component) {
            this.updateMarkupValue(display, component.autoOff);
            this.setComponentElement(component);
			this.automateLight(component.autoOff, component);
		}
	}

	getSelectedComponent(componentName: string): ComponentInterface {
		if (!componentName) return this.componentsData[0];
		return this.componentsData[componentName.toLowerCase()];
	}

	getSelectedSettings(componentName: string) {
		return this.#markup(this.getSelectedComponent(componentName));
	}

	setNewData(component: ComponentInterface, key: string, data: string) {
		return ((this.componentsData[component.name] as { [key: string]: any })[key] = data);
	}

	capFirstLetter(word: string) {
		return word.replace(word[0], word[0].toUpperCase());
	}

	getObjectDetails() {
		return this;
	}

	formatTime(time: string) {
		const [hour, min] = time.split(":");
		const date = new Date();
		date.setHours(parseInt(hour));
		date.setMinutes(parseInt(min));
		date.setSeconds(0);
		return date;
	}

	timeDifference(selectedTime: string) {
		const now = new Date();
		const difference = this.formatTime(selectedTime).getTime() - now.getTime();
		console.log(difference, now);
		return difference;
	}

	async timer(time: Date, message: any, component: HTMLElement) {
		return new Promise((resolve) => {
			const intervalId = setInterval(() => {
				const now = new Date();
				if (
					now.getHours() === time.getHours() &&
					now.getMinutes() === time.getMinutes() &&
					now.getSeconds() === time.getSeconds()
				) {
					resolve(this.toggleLightSwitch(component));
					clearInterval(intervalId);
				}
			}, 1000);
		});
	}

	async automateLight(time: string, component: any) {
		const formatted = this.formatTime(time);
		return await this.timer(formatted, true, component);
	}
}

export default AdvanceSettings;