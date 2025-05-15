1. removed the array literals holding the single strings as keys since they make the code redundant in the general.js file.

2.The updateComponentData method on line 81 doesn't do anything with the data parameter passed into the method. assigned the data parameter to this.componentsData to update it in the general.ts file.

3. for the lightComponentSelectors method on line 43 of the basicSettings.ts file, removed the "[0]" from the rooms[0] on line 45 since this.getComponent() is expected to return a string, having [0] would return the letter at the first index of the string instead of the entire string.

5. on line 75 of the basicSettings.ts file,the handle handleLightIntensitySlider method has "typeof(intensity) === isNaN", which returns an error since isNan is a function and not a type. changed it to isNaN(intensity).


6. refactored the if statement in line 81 to turn the light on if the intensity is more than 0 and off if its equal to 0

7. the displayNotification and removeNotification methods in the basicSettings.js file already exist in the general class and have been inherited, removed them to prevent redundancy in the code.

8. the sliderLight method on line 75 of the basicSettings.js file doesnt update the component.isLightOn, added it to fix the code.