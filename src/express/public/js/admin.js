'use strict';

function getCheckedCategories(inputData, labelName) {
  const controls= document.getElementsByName(inputData);
  const storyLabel= document.getElementsByName(labelName);

  for(let i=0; i < controls.length; i++) {
    if(controls[i].checked) {
      storyLabel.value += controls[i].value.toString() + ',';
    }
  }
  return storyLabel;
}
