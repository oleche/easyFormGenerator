/**
 *  ------------------------------------------------------
 *  module core : injects core "non app modules"
 *  ------------------------------------------------------
 *
 * 
 * ——————————————————————————————————————————————
 * MIT (2015) - Erwan Datin (MacKentoch)
 * https://github.com/MacKentoch/easyFormGenerator
 * ——————————————————————————————————————————————
**/

(function(){
	'use strict';
	
	angular
		.module('eda.easyFormSteWayConfigProvider', [])
		.provider('easyFormSteWayConfig', easyFormSteWayConfigFct);
		
		easyFormSteWayConfigFct.$inject = [];
		
		function easyFormSteWayConfigFct(){
			var _configuration 			=  defaultConfig();
			/* jshint validthis:true */
			this.$get 							= easyFormSteWayConfig;
			this.setModalAnimation 	= setModalAnimation;
			this.getModalAnimation	= getModalAnimation;
			this.configuration 			= _configuration;
    	
			
			
		
			//set default config
			function defaultConfig(){
				var _defaultConfiguration = {
					modalAnimated : false
				};
				return _defaultConfiguration;
			}
		
			
			function setModalAnimation(flagConfig){
				var valueToApply = (flagConfig === true) ? 
														  flagConfig  
														: (flagConfig === false ? 
															  flagConfig 
															: _configuration.modalAnimated);
																	
				_configuration.modalAnimated = valueToApply;
			}

			function getModalAnimation(){																	
				return _configuration.modalAnimated;
			}		
			
		
			//$get implementation :
			easyFormSteWayConfig.$inject = [];
			function easyFormSteWayConfig(){
													
				var service = {
					setModalAnimation 			: setModalAnimationFct,
					getModalAnimationValue 	: getModalAnimationValue
				};
				return service;
				
				
				function getModalAnimationValue(){
					return _configuration.modalAnimated;
				}				
				
				function setModalAnimationFct(value){
					setModalAnimation(value);
				}
				

				
			}
		
		}
		
		
		
})();