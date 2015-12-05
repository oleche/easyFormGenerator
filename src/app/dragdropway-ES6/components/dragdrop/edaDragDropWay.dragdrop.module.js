/* global angular */
import ddContentCounter, {
 DD_CONTENT_COUNTER_DIRECTIVE	
}																			from './edaDragDropWay.dragdrop.ddContentCounter.directive';
import ddDecorContainerDirective, {
	DD_DECOR_CONTAINER_DIRECTIVE
} 																		from './ddDecorContainer/edaDragDropWay.dragdrop.ddDecorContainer.directive';
import ddDecorContainerController, {
	DD_DECOR_CONTAINER_CONTROLLER_NAME
} 																		from './ddDecorContainer/edaDragDropWay.dragdrop.ddDecorContainer.controller';
import ddDecorDropZone, {
	DD_DECOR_DROPZONE_DIRECTIVE
} 																		from './ddDecorDropZone/edaDragDropWay.dragdrop.ddDecorDropZone.directive';
import ddDecorItem, {
	DRAG_DROP_DECOR_ITEM
} 																		from './ddDecorItem/edaDragDropWay.dragdrop.ddDecorItem.directive';
import ddNoEditableControl, {
	DRAG_DROP_NO_EDITABLE_CONTROL
} 																		from './ddNoEditableControl/edaDragDropWay.dragdrop.ddNoEditableControl.directive';
import edaRightClick, {
	EDA_RIGHT_CLICK_DIRECTIVE
} 																		from './edaRightClick/edaDragDropWay.dragdrop.edaRightClick.directive';

const DRAGDROP_MODULE = 'edaDragDropWay.dragdrop.module';


export default angular
								.module(DRAGDROP_MODULE, [])
								.directive(DD_CONTENT_COUNTER_DIRECTIVE, ddContentCounter)
								.controller(DD_DECOR_CONTAINER_CONTROLLER_NAME, ddDecorContainerController)
								.directive(DD_DECOR_CONTAINER_DIRECTIVE, ddDecorContainerDirective)
								.directive(DD_DECOR_DROPZONE_DIRECTIVE, ddDecorDropZone)
								.directive(DRAG_DROP_DECOR_ITEM, ddDecorItem)
								.directive(DRAG_DROP_NO_EDITABLE_CONTROL, ddNoEditableControl)
								.directive(EDA_RIGHT_CLICK_DIRECTIVE, edaRightClick);