# Code Refactoring Summary

1. Removed the array literals holding the single strings as keys since they make the code redundant in the `general.js` file.

2. The `updateComponentData` method on line 81 doesn't do anything with the `data` parameter passed into the method. Assigned the `data` parameter to `this.componentsData` to update it in the `general.ts` file.

3. For the `lightComponentSelectors` method on line 43 of the `basicSettings.ts` file, removed the `[0]` from `rooms[0]` on line 45 since `this.getComponent()` is expected to return a string. Having `[0]` would return the letter at the first index of the string instead of the entire string.

4. On line 75 of the `basicSettings.ts` file, the `handleLightIntensitySlider` method has `typeof(intensity) === isNaN`, which returns an error since `isNaN` is a function and not a type. Changed it to `isNaN(intensity)`.

5. Refactored the if statement in line 81 to turn the light on if the intensity is more than 0 and off if it's equal to 0.

6. The `displayNotification` and `removeNotification` methods in the `basicSettings.js` file already exist in the general class and have been inherited. Removed them to prevent redundancy in the code.

7. The `sliderLight` method on line 75 of the `basicSettings.js` file doesn't update `component.isLightOn`. Added it to fix the code.

8. In line 141 of the `advanceSettings.js` file, `!!value` converts a value to a boolean instead of checking if it returns true or false. Changed it to `!value`.

9. Removed the `message` and `resolve` input parameters in line 233 of the async timer function since they are not being used in the function code.

10. For the `formatTime` function, returned `null` if the time string doesn't include `:` and if it is not a valid time format.

11. Removed duplicate close button in markup code on line 67.