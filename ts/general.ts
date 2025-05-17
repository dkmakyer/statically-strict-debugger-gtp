// export default General

type SignalStrength = 'excellent' | 'good' | 'poor';

type ComponentData = {
	name: string;
	lightIntensity: number;
	numOfLights: number;
	isLightOn: boolean;
	autoOn: string;
	autoOff: string;
	usage: number[];
	element?: HTMLElement;
};

type RoomDataType = {
	[key: string]: ComponentData;
};

type WifiConnection = {
	id: number;
	wifiName: string;
	signal: SignalStrength;
};

class General {
	componentsData: RoomDataType = {
		hall: {
			name: "hall",
			lightIntensity: 5,
			numOfLights: 6,
			isLightOn: false,
			autoOn: "06:30",
			autoOff: "22:00",
			usage: [22, 11, 12, 10, 12, 17, 22],
		},
		bedroom: {
			name: "bedroom",
			lightIntensity: 5,
			numOfLights: 3,
			isLightOn: false,
			autoOn: "06:30",
			autoOff: "22:00",
			usage: [18, 5, 7, 5, 6, 6, 18],
		},
		bathroom: {
			name: "bathroom",
			lightIntensity: 5,
			numOfLights: 1,
			isLightOn: false,
			autoOn: "06:30",
			autoOff: "22:00",
			usage: [2, 1, 1, 1, 1, 3, 3],
		},
		"outdoor lights": {
			name: "outdoor lights",
			lightIntensity: 5,
			numOfLights: 6,
			isLightOn: false,
			autoOn: "06:30",
			autoOff: "22:00",
			usage: [15, 12, 13, 9, 12, 13, 18],
		},
		"guest room": {
			name: "guest room",
			lightIntensity: 5,
			numOfLights: 4,
			isLightOn: false,
			autoOn: "06:30",
			autoOff: "22:00",
			usage: [12, 10, 3, 9, 5, 5, 18],
		},
		kitchen: {
			name: "kitchen",
			lightIntensity: 5,
			numOfLights: 3,
			isLightOn: false,
			autoOn: "06:30",
			autoOff: "22:00",
			usage: [12, 19, 13, 11, 12, 13, 18],
		},
		"walkway & corridor": {
			name: "walkway & corridor",
			lightIntensity: 5,
			numOfLights: 8,
			isLightOn: false,
			autoOn: "06:30",
			autoOff: "22:00",
			usage: [12, 19, 13, 15, 22, 23, 18],
		},
	};

	wifiConnections: WifiConnection[] = [
		{ id: 0, wifiName: "Inet service", signal: "excellent" },
		{ id: 1, wifiName: "Kojo_kwame121", signal: "poor" },
		{ id: 2, wifiName: "spicyalice", signal: "good" },
		{ id: 3, wifiName: "virus", signal: "good" },
	];

	isLightOn = false;
	lightIntensity = 5;

	getComponent(name: string): ComponentData {
		return this.componentsData[name];
	}

	getWifi(): WifiConnection[] {
		return this.wifiConnections;
	}

	getSelectedComponentName(
		element: HTMLElement | null,
		ancestorIdentifier = ".rooms",
		elementSelector = "p"
	): string | null {
		const selectedElement = this.closestSelector(element, ancestorIdentifier, elementSelector);
		return selectedElement?.textContent?.toLowerCase() ?? null;
	}

	getComponentData(
		element: HTMLElement,
		ancestorIdentifier: string,
		childElement: string
	): ComponentData | null {
		const room = this.getSelectedComponentName(element, ancestorIdentifier, childElement);
		return room ? this.getComponent(room) : null;
	}

	renderHTML(html: string, position: InsertPosition, container: HTMLElement): void {
		container.insertAdjacentHTML(position, html);
	}

	notification(message: string): string {
		return `
			<div class="notification">
				<p>${message}</p>
			</div>
		`;
	}

	displayNotification(message: string, position: InsertPosition, container: HTMLElement): void {
		const html = this.notification(message);
		this.renderHTML(html, position, container);
	}

	removeNotification(element: HTMLElement): void {
		setTimeout(() => element.remove(), 2000);
	}

	selector(identifier: string): HTMLElement | null {
		return document.querySelector(identifier);
	}

	closestSelector(
		selectedElement: HTMLElement | null,
		ancestorIdentifier: string,
		childSelector: string
	): HTMLElement | null {
		const closestAncestor = selectedElement?.closest(ancestorIdentifier);
		return closestAncestor?.querySelector(childSelector) ?? null;
	}

	handleLightIntensity(element: HTMLElement | null, lightIntensity: number): void {
		if (element) {
			element.style.filter = `brightness(${lightIntensity})`;
		}
	}

	updateComponentData(data: RoomDataType): void {
		this.componentsData = data;
	}

	updateMarkupValue(element: HTMLElement, value: string | number): void {
		element.textContent = value.toString();
	}

	toggleHidden(element: HTMLElement): void {
		element.classList.toggle("hidden");
	}

	removeHidden(element: HTMLElement): void {
		element.classList.remove("hidden");
	}

	addHidden(element: HTMLElement): void {
		element.classList.add("hidden");
	}

	setComponentElement(roomData: ComponentData): void {
		let parent: HTMLElement | null = null;

		switch (roomData.name) {
			case "walkway & corridor":
				parent = this.selector(".corridor");
				break;
			case "guest room":
				parent = this.selector(`.${this.formatTextToClassName(roomData.name)}`);
				break;
			case "outdoor lights":
				parent = this.selector(".outside_lights");
				break;
			default:
				parent = this.selector(`.${roomData.name}`);
		}

		if (!parent || roomData.element) return;

		const buttonElement = parent.querySelector<HTMLElement>(".light-switch");
		if (buttonElement) {
			roomData.element = buttonElement;
		}
	}

	formatTextToClassName(name: string): string {
		return name.split(" ").join("_");
	}
}

export default General;
