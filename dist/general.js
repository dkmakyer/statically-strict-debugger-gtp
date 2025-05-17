// export default General
class General {
    constructor() {
        this.componentsData = {
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
        this.wifiConnections = [
            { id: 0, wifiName: "Inet service", signal: "excellent" },
            { id: 1, wifiName: "Kojo_kwame121", signal: "poor" },
            { id: 2, wifiName: "spicyalice", signal: "good" },
            { id: 3, wifiName: "virus", signal: "good" },
        ];
        this.isLightOn = false;
        this.lightIntensity = 5;
    }
    getComponent(name) {
        return this.componentsData[name];
    }
    getWifi() {
        return this.wifiConnections;
    }
    getSelectedComponentName(element, ancestorIdentifier = ".rooms", elementSelector = "p") {
        var _a, _b;
        const selectedElement = this.closestSelector(element, ancestorIdentifier, elementSelector);
        return (_b = (_a = selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : null;
    }
    getComponentData(element, ancestorIdentifier, childElement) {
        const room = this.getSelectedComponentName(element, ancestorIdentifier, childElement);
        return room ? this.getComponent(room) : null;
    }
    renderHTML(html, position, container) {
        container.insertAdjacentHTML(position, html);
    }
    notification(message) {
        return `
			<div class="notification">
				<p>${message}</p>
			</div>
		`;
    }
    displayNotification(message, position, container) {
        const html = this.notification(message);
        this.renderHTML(html, position, container);
    }
    removeNotification(element) {
        setTimeout(() => element.remove(), 2000);
    }
    selector(identifier) {
        return document.querySelector(identifier);
    }
    closestSelector(selectedElement, ancestorIdentifier, childSelector) {
        var _a;
        const closestAncestor = selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.closest(ancestorIdentifier);
        return (_a = closestAncestor === null || closestAncestor === void 0 ? void 0 : closestAncestor.querySelector(childSelector)) !== null && _a !== void 0 ? _a : null;
    }
    handleLightIntensity(element, lightIntensity) {
        if (element) {
            element.style.filter = `brightness(${lightIntensity})`;
        }
    }
    updateComponentData(data) {
        this.componentsData = data;
    }
    updateMarkupValue(element, value) {
        element.textContent = value.toString();
    }
    toggleHidden(element) {
        element.classList.toggle("hidden");
    }
    removeHidden(element) {
        element.classList.remove("hidden");
    }
    addHidden(element) {
        element.classList.add("hidden");
    }
    setComponentElement(roomData) {
        let parent = null;
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
        if (!parent || roomData.element)
            return;
        const buttonElement = parent.querySelector(".light-switch");
        if (buttonElement) {
            roomData.element = buttonElement;
        }
    }
    formatTextToClassName(name) {
        return name.split(" ").join("_");
    }
}
export default General;
