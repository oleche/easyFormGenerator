/**
 *  ------------------------------------------------------
 *  service : formFieldManage
 *  ------------------------------------------------------
 *
 *         MOST IMPORTANT service to manage formly field model 
 *  (the presentation model and the back model or configuration model)
 * 
 *
 *  - "formlyModel" is the model exposed to view or html "fields model" (= an array of objects)
 *    This model is the one you can see in all well documented examples here : http://angular-formly.com
 *    -> in your view or html : <formly-form model="dataModel" fields="formlyModel">
 *
 *  - "configurationModel" is the model on which editing a form will work
 *    before applying results to "formlyModel"
 *
 *
 * NOTE : if you save a form to database, you will save "configurationModel" rather than "formlyModel".
 *        Why? : 
 *          since as you plan to create a form generator you can't create a finite model
 *          since you may want to be able to save the generated form even if it is not a finite model
 *          since "formlyModel" objects will be populated with a lot of properties you don't need to store contrary to "configurationModel" which contains only what you need
 *          since "formlyModel" can't be JSON.stringify when you want to use advanced layout (1 column/2/3 columns template?)
 *          since it is better approach to use a backgroundModel (async operation ...) that is bind to presentation model only when it is fully ready or filled.
 *
 *
 * NOTE : 
 * - if you want to manage more columns templates (right now only manage up to 3 columns), just inspire from existing code
 * - if you want to extend easy form generator, be sure to be a minimum comfortable with "angular formly": http://angular-formly.com
 * 
 * ——————————————————————————————————————————————
 * MIT (2015) - Erwan Datin (MacKentoch)
 * https://github.com/MacKentoch/easyFormGenerator
 * ——————————————————————————————————————————————
**/
angular
  .module('edaApp.services.formFieldManage', [])
  .factory('formFieldManage', [ 'EasyFormGenFormlyBindingModels', 

  function( EasyFormGenFormlyBindingModels ){

    var Service = {};

    /**
     * At initial state : configuration model will contain 1 line, since :
     *    -> it is non sense to create a form without a single line (no line = no form at all)
     *    -> so it is non sense to force user to add a first line
     * 
     *  PLEASE NOTE columns array contains objects that look like formly fields one
     */
    Service.initConfigurationEditFromScratch =  function(configurationModel, addStepWayProperties){
      var configurationModelInit = EasyFormGenFormlyBindingModels.getEasyFormInitialStateConfigurationModel(addStepWayProperties); 
      angular.copy(configurationModelInit, configurationModel);
    };

    /**
     * Get an configuration empty (no init line) then empty it with lines array provided in param
     * @param   object - configurationModel   [configuration model]
     * @param   array -  lines                [an array : lines to apply to an empty configuration model]
     * @param   bool -   addStepWayProperties [description]
     * @return {object message}               [give details on how it happened to caller]
     */
    Service.bindConfigurationLines = function(configurationModel, lines, addStepWayProperties){
              
      if( Object.prototype.toString.call(lines) === '[object Array]' ) {
        var configurationModelResult = EasyFormGenFormlyBindingModels.getEasyFormReloadConfigurationModel(addStepWayProperties);

        configurationModelResult.lines = [].concat(lines);  
        angular.copy(configurationModelResult, configurationModel);                                         

        return getMessageObject('configuration model is bound','lines are bound to configuration model.');
      }else{
        return getErrorObject('lines is not an array', 'Checks lines type, it is not an array.');
      }
    };
    /**
     * applyConfigurationToformlyModel : 
     *  - bind configuration model into formly field model
     *  - reset dataModel (formlyfield may have changed so previous dataModel would be false)
     * @param  configurationModel 
     * @param  formlyModel        
     * @param  formlyDataModel    
     */
    Service.applyConfigurationToformlyModel = function(configurationModel, formlyModel, formlyDataModel){
      resetFormlyModel(formlyModel);
      resetDataModel(formlyDataModel);

      //manage header here line0
      var lineNumber = configurationModel.lines.length;


      

      for (var i = 0; i < lineNumber; i++) {


        /**
         * TO TEST
         */
        
        //var FieldGroup = [];
        AddNColumnControl(formlyModel, configurationModel, i);


        // FieldGroup.push(controlTemplate);


        
        // formlyModel.push(
        //                    {
        //                       className   : 'row', 
        //                       fieldGroup  : FieldGroup
        //                     }
        //                 ); 
      }
    };
        
    return Service;



    function resetFormlyModel(formlyModel){
      var resetformly = [];
      angular.copy(resetformly, formlyModel);
    }

    /**
     * New auuto adpat  add N column controls
     */
    function AddNColumnControl(formlyModel, configurationModel, lineIndex){

      var numberOfColumns = configurationModel.lines[lineIndex].columns.length;

      
      /**
       * push formly model 
       * 
       * here : only className and empty fieldGroup (controls != header)
       *
       * if header will be reset to set a template (at least we have now indexFormlyModel)
       */
      
      //get index formlyModel for this line :
      var indexFormlyModel =  formlyModel.push(
                                               {
                                                  className   : 'row', 
                                                  fieldGroup  : []
                                                }
                                              ) - 1 ;        

      /**
       * iterates through controls in the line
       */
      
      configurationModel.lines[lineIndex].columns.forEach(function(column){
        var controlTemplate = {};

        if (( typeof controlTemplate  !== 'undefined' &&
              column.control.type     === 'header' || 
              column.control.type     === 'subTitle') &&
              column.control.type     !== 'none') {
            /**
             * header is not a control just a template
             *
             * getHeaderTemplateForNcolumnLine()
             * NOTE : header text is stored from description
             */
            
            var headerTextContent = column.control.templateOptions.description;
            controlTemplate = EasyFormGenFormlyBindingModels.getHeaderTemplateForNcolumnLine(numberOfColumns, headerTextContent);
            /**
             * popuplate properties
             *
             */
            formlyModel[indexFormlyModel] = {};

            formlyModel[indexFormlyModel].template = controlTemplate.template;
             /**
              * push
              */
        }
        
        if (typeof controlTemplate  !== 'undefined' &&
            column.control.type     !== 'header' && 
            column.control.type     !== 'subTitle' &&
            column.control.type     !== 'none') {

          /**
           * controls : getFormlyControlTemplateForNcolumnLine()
           *
           * @PARAM numberOfColumns       : integer to deduce cssClss to apply
           * @PARAM column.control.type   : to add if needed specific properties (example : datepicker)
           */
          controlTemplate = EasyFormGenFormlyBindingModels.getFormlyControlTemplateForNcolumnLine(numberOfColumns, column.control.type);
          /**
           * popuplate properties
           */
          
          console.warn( [
                          'debug AddNColumnControl',
                          '\ncolumn.control.type : ',
                          column.control.type

                        ].join('')
                      );
          console.dir(  
                        {
                          'desired controlTemplate': '<- this was title' ,
                          controlTemplate : controlTemplate
                        }
                      );


          /**
           * TODO need to validate all controls (datepicker may not work)
           * need to refactor
           */
          controlTemplate.className                   = column.control.className;
          controlTemplate.type                        = column.control.type;
          controlTemplate.key                         = column.control.key;
          controlTemplate.templateOptions.type        = column.control.templateOptions.type;
          controlTemplate.templateOptions.label       = column.control.templateOptions.label;
          controlTemplate.templateOptions.required    = column.control.templateOptions.required;
          controlTemplate.templateOptions.placeholder = column.control.templateOptions.placeholder;
          controlTemplate.templateOptions.description = column.control.templateOptions.description;
          controlTemplate.templateOptions.options     = [].concat(column.control.templateOptions.options); 

          if (typeof controlTemplate.templateOptions.datepickerPopup !== 'undefined')  column.control.templateOptions.datepickerPopup = controlTemplate.templateOptions.datepickerPopup  ;



          /**
           * push control into formly model in its group
           */
          formlyModel[indexFormlyModel].fieldGroup.push(controlTemplate);         

          }
        }

      );
    }    

    function AddOneColumnHeader(formlyModel, configurationModel,lineIndex){
      /**
       * NOTE : text header is stored in "description" in templateOtion model
       */
      var headerTemplateCol0 =  [
                                  '<div class="row">',
                                  '  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">',
                                  '    <h2 class="text-center">', 
                                       extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[0].control), 
                                  '    <h2>',
                                  '  </div>',
                                  '</div>',
                                  '<hr/>'
                                ].join('');
      formlyModel.push(
                        {
                          template: typeof configurationModel.lines[lineIndex].columns[0].control.type !== 'undefined' ? (configurationModel.lines[lineIndex].columns[0].control.type === 'header' ? headerTemplateCol0 : '<div></div>') : '<div></div>'
                        }
                      );
    }


    function AddDatepickerPopupProperty(fieldToPush, configurationModel,lineIndex){
      fieldToPush.templateOptions.datepickerPopup = extractTemplateOptionDatepickerPopup(configurationModel.lines[lineIndex].columns[0].control);
    }

    function AddOneColumnControl(formlyModel, configurationModel,lineIndex){

      var fieldToPush = {
                          className : 'col-xs-12',
                          type      : typeof configurationModel.lines[lineIndex].columns[0].control.type  !== 'undefined' ? (configurationModel.lines[lineIndex].columns[0].control.type === 'none' ? 'blank': configurationModel.lines[lineIndex].columns[0].control.type): 'blank',
                          key       : typeof configurationModel.lines[lineIndex].columns[0].control.key   !== 'undefined' ?  configurationModel.lines[lineIndex].columns[0].control.key : 'blank' + Date.now(),
                          
                          templateOptions: {
                                type        : extractTemplateOptionType(configurationModel.lines[lineIndex].columns[0].control),
                                label       : extractTemplateOptionLabel(configurationModel.lines[lineIndex].columns[0].control),
                                required    : extractTemplateOptionRequired(configurationModel.lines[lineIndex].columns[0].control),
                                placeholder : extractTemplateOptionPlaceholder(configurationModel.lines[lineIndex].columns[0].control),
                                description : extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[0].control),
                                options     : extractTemplateOptionOptions(configurationModel.lines[lineIndex].columns[0].control)
                          } 
                        };
      /**
       * datepicker additionnal particular property   
       */
      if (configurationModel.lines[lineIndex].columns[0].control.type === 'datepicker') {
        AddDatepickerPopupProperty(fieldToPush, configurationModel,lineIndex);
      }     

      formlyModel.push( 
                        fieldToPush
                      );
    }

    function AddTwoColumnControl(formlyModel, configurationModel,lineIndex){
      /**
       * NOTE : text header is stored in "description" in templateOtion model
       */
      var headerTemplateCol0 =  {
                                  className   : 'col-xs-6',
                                  template    :   [
                                                    '<div class="row">',
                                                    '  <div class="">',
                                                    '    <h2 class="text-center">', 
                                                         extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[0].control), 
                                                    '    <h2>',
                                                    '    <hr/>',
                                                    '  </div>',
                                                    '</div>'
                                                  ].join('')
                                };

      var headerTemplateCol1 =  {
                                  className   : 'col-xs-6',
                                  template    :   [
                                                    '<div class="row">',
                                                    '  <div class="">',
                                                    '    <h2 class="text-center">', 
                                                         extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[1].control), 
                                                    '    <h2>',
                                                    '    <hr/>',
                                                    '  </div>',
                                                    '</div>'
                                                  ].join('')
                                };

      var controlCol0 =     {
                                className : 'col-xs-6',
                                type      : typeof configurationModel.lines[lineIndex].columns[0].control.type  !== 'undefined' ? (configurationModel.lines[lineIndex].columns[0].control.type === 'none' ? 'blank': configurationModel.lines[lineIndex].columns[0].control.type): 'blank',
                                key       : typeof configurationModel.lines[lineIndex].columns[0].control.key   !== 'undefined' ?  configurationModel.lines[lineIndex].columns[0].control.key : 'blank' + Date.now(),
                                templateOptions: {
                                    type        : extractTemplateOptionType(configurationModel.lines[lineIndex].columns[0].control),
                                    label       : extractTemplateOptionLabel(configurationModel.lines[lineIndex].columns[0].control),
                                    required    : extractTemplateOptionRequired(configurationModel.lines[lineIndex].columns[0].control),
                                    placeholder : extractTemplateOptionPlaceholder(configurationModel.lines[lineIndex].columns[0].control),
                                    description : extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[0].control),
                                    options     : extractTemplateOptionOptions(configurationModel.lines[lineIndex].columns[0].control)             
                                }
                              };
      /**
       * datepicker additionnal particular property   
       */                
      if (configurationModel.lines[lineIndex].columns[0].control.type === 'datepicker') {
        AddDatepickerPopupProperty(controlCol0, configurationModel,lineIndex);
      }                            

      var controlCol1 =  {
                                className : 'col-xs-6',
                                type      : typeof configurationModel.lines[lineIndex].columns[1].control.type  !== 'undefined' ?  (configurationModel.lines[lineIndex].columns[1].control.type === 'none' ? 'blank': configurationModel.lines[lineIndex].columns[1].control.type) : 'blank',
                                key       : typeof configurationModel.lines[lineIndex].columns[1].control.key   !== 'undefined' ?  configurationModel.lines[lineIndex].columns[1].control.key : 'blank' + Date.now(),
                                templateOptions: {
                                    type        : extractTemplateOptionType(configurationModel.lines[lineIndex].columns[1].control),
                                    label       : extractTemplateOptionLabel(configurationModel.lines[lineIndex].columns[1].control),
                                    required    : extractTemplateOptionRequired(configurationModel.lines[lineIndex].columns[1].control),
                                    placeholder : extractTemplateOptionPlaceholder(configurationModel.lines[lineIndex].columns[1].control),
                                    description : extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[1].control),
                                    options     : extractTemplateOptionOptions(configurationModel.lines[lineIndex].columns[1].control)             
                                }
                        };

      //////////////////////////////////////////////                  
      //datepicker additionnal particular property  
      //////////////////////////////////////////////                  
      if (configurationModel.lines[lineIndex].columns[1].control.type === 'datepicker') {
        AddDatepickerPopupProperty(controlCol1, configurationModel,lineIndex);
      }                                

      var FieldGroup = [];

      if (configurationModel.lines[lineIndex].columns[0].control.type === 'header') {
        FieldGroup.push(headerTemplateCol0);
      }else{
        FieldGroup.push(controlCol0);
      }
       
      if (configurationModel.lines[lineIndex].columns[1].control.type === 'header') {
        FieldGroup.push(headerTemplateCol1);
      }else{
        FieldGroup.push(controlCol1);
      }    

      formlyModel.push(
                         {
                            className: 'row', 
                            fieldGroup: FieldGroup
                          }
                      );
    }



    function AddThreeColumnControl(formlyModel, configurationModel,lineIndex){

        //text header is stored in "description" in templateOtion model
        var headerTemplateCol0 =  {
                                    className : 'col-xs-4',
                                    template  :   [
                                                    '<div class="row">',
                                                    '  <div class="">',
                                                    '    <h2 class="text-center">', 
                                                         extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[0].control), 
                                                    '    <h2>',
                                                    '    <hr/>',
                                                    '  </div>',
                                                    '</div>'
                                                  ].join()
                                  };

        var headerTemplateCol1 =  {
                                    className : 'col-xs-4',
                                    template  : '<div class="row"><div class=""><h2 class="text-center">' + extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[1].control) + '<h2><hr/></div></div>'
                                  };

        var headerTemplateCol2 =  {
                                    className : 'col-xs-4',
                                    template  : '<div class="row"><div class=""><h2 class="text-center">' + extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[2].control) + '<h2><hr/></div></div>'
                                  };
      

        var controlCol0 =     {
                                  className : 'col-xs-4',
                                  type      : typeof configurationModel.lines[lineIndex].columns[0].control.type  !== 'undefined' ? (configurationModel.lines[lineIndex].columns[0].control.type === 'none' ? 'blank': configurationModel.lines[lineIndex].columns[0].control.type): 'blank',
                                  key       : typeof configurationModel.lines[lineIndex].columns[0].control.key   !== 'undefined' ?  configurationModel.lines[lineIndex].columns[0].control.key : 'blank' + Date.now(),
                                  templateOptions: {
                                      type        : extractTemplateOptionType(configurationModel.lines[lineIndex].columns[0].control),
                                      label       : extractTemplateOptionLabel(configurationModel.lines[lineIndex].columns[0].control),
                                      required    : extractTemplateOptionRequired(configurationModel.lines[lineIndex].columns[0].control),
                                      placeholder : extractTemplateOptionPlaceholder(configurationModel.lines[lineIndex].columns[0].control),
                                      description : extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[0].control),
                                      options     : extractTemplateOptionOptions(configurationModel.lines[lineIndex].columns[0].control)             
                                  }
                                };
        //////////////////////////////////////////////                  
        //datepicker additionnal particular property  
        //////////////////////////////////////////////                  
        if (configurationModel.lines[lineIndex].columns[0].control.type === 'datepicker') {
          AddDatepickerPopupProperty(controlCol0, configurationModel,lineIndex);
        }                             

        var controlCol1 =  {
                                  className: 'col-xs-4',
                                  type: typeof configurationModel.lines[lineIndex].columns[1].control.type !== 'undefined' ?  (configurationModel.lines[lineIndex].columns[1].control.type === 'none' ? 'blank': configurationModel.lines[lineIndex].columns[1].control.type) : 'blank',
                                  key: typeof configurationModel.lines[lineIndex].columns[1].control.key !== 'undefined' ?  configurationModel.lines[lineIndex].columns[1].control.key : 'blank' + Date.now(),
                                  templateOptions: {
                                      type: extractTemplateOptionType(configurationModel.lines[lineIndex].columns[1].control),
                                      label: extractTemplateOptionLabel(configurationModel.lines[lineIndex].columns[1].control),
                                      required : extractTemplateOptionRequired(configurationModel.lines[lineIndex].columns[1].control),
                                      placeholder : extractTemplateOptionPlaceholder(configurationModel.lines[lineIndex].columns[1].control),
                                      description : extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[1].control),
                                      options : extractTemplateOptionOptions(configurationModel.lines[lineIndex].columns[1].control)             
                                  }
                          };
        //////////////////////////////////////////////                  
        //datepicker additionnal particular property  
        //////////////////////////////////////////////                  
        if (configurationModel.lines[lineIndex].columns[1].control.type === 'datepicker') {
          AddDatepickerPopupProperty(controlCol1, configurationModel,lineIndex);
        }                       
        var controlCol2 =  {
                                  className: 'col-xs-4',
                                  type: typeof configurationModel.lines[lineIndex].columns[2].control.type !== 'undefined' ?  (configurationModel.lines[lineIndex].columns[2].control.type === 'none' ? 'blank': configurationModel.lines[lineIndex].columns[2].control.type) : 'blank',
                                  key: typeof configurationModel.lines[lineIndex].columns[2].control.key !== 'undefined' ?  configurationModel.lines[lineIndex].columns[2].control.key : 'blank' + Date.now(),
                                  templateOptions: {
                                      type: extractTemplateOptionType(configurationModel.lines[lineIndex].columns[2].control),
                                      label: extractTemplateOptionLabel(configurationModel.lines[lineIndex].columns[2].control),
                                      required : extractTemplateOptionRequired(configurationModel.lines[lineIndex].columns[2].control),
                                      placeholder : extractTemplateOptionPlaceholder(configurationModel.lines[lineIndex].columns[2].control),
                                      description : extractTemplateOptionDescription(configurationModel.lines[lineIndex].columns[2].control),
                                      options : extractTemplateOptionOptions(configurationModel.lines[lineIndex].columns[2].control)             
                                  }
                          };
        //////////////////////////////////////////////                  
        //datepicker additionnal particular property  
        //////////////////////////////////////////////                  
        if (configurationModel.lines[lineIndex].columns[2].control.type === 'datepicker') {
          AddDatepickerPopupProperty(controlCol2, configurationModel,lineIndex);
        }     

        var FieldGroup = [];

        if (configurationModel.lines[lineIndex].columns[0].control.type === 'header') {
          FieldGroup.push(headerTemplateCol0);
        }else{
          FieldGroup.push(controlCol0);
        }
         
        if (configurationModel.lines[lineIndex].columns[1].control.type === 'header') {
          FieldGroup.push(headerTemplateCol1);
        }else{
          FieldGroup.push(controlCol1);
        }    

        if (configurationModel.lines[lineIndex].columns[2].control.type === 'header') {
          FieldGroup.push(headerTemplateCol2);
        }else{
          FieldGroup.push(controlCol2);
        }    


        formlyModel.push(
                           {
                              className: 'row', 
                              fieldGroup: FieldGroup
                            }
                        );
    }



    function isTemplateOptionDefined(obj){
      return typeof obj.templateOptions !== 'undefined' ? true : false;
    }

    function extractTemplateOptionLabel(obj){

     //console.info('extractTemplateOptionLabel');
     //console.dir(obj);
     return  typeof obj.templateOptions !== 'undefined' ? (typeof obj.templateOptions.label !== 'undefined'? obj.templateOptions.label: '') : '';
    }


    function extractTemplateOptionDatepickerPopup(obj){
      return  typeof obj.templateOptions !== 'undefined' ? (typeof obj.templateOptions.datepickerPopup !== 'undefined'? obj.templateOptions.datepickerPopup: '') : '';
    }

    function extractTemplateOptionRequired(obj){
      return  typeof obj.templateOptions !== 'undefined' ? (typeof obj.templateOptions.required !== 'undefined'? obj.templateOptions.required: '') : '';
    }
    //radio and select
    function extractTemplateOptionOptions(obj){
      return  typeof obj.templateOptions !== 'undefined' ? (typeof obj.templateOptions.options !== 'undefined'? obj.templateOptions.options: '') : '';
    }



    function extractTemplateOptionType(obj){
      return  typeof obj.subtype !== 'undefined'? obj.subtype: '';
    }

    function extractTemplateOptionPlaceholder(obj){
      return  typeof obj.templateOptions !== 'undefined' ? (typeof obj.templateOptions.placeholder !== 'undefined'? obj.templateOptions.placeholder: '') : '';
    }

    function extractTemplateOptionDescription(obj){
      return  typeof obj.templateOptions !== 'undefined' ? (typeof obj.templateOptions.description !== 'undefined'? obj.templateOptions.description: '') : '';
    }


    /////////////////////////////////////////
    // formly model functions
    /////////////////////////////////////////

    function resetDataModel(obj){
      var emptyDataModel = {};
      angular.copy(emptyDataModel, obj);
      return true;
    }

    /////////////////////////////////////////
    // custom errors
    /////////////////////////////////////////

    var messageObj =  {
                          noError   : false,
                          title     : '',
                          Message   : ''  
                      };

    function getErrorObject(errorTitle, errorMessage){

      var messageObj =  {
                          noError   : false,
                          title     : '',
                          Message   : ''  
                        };

      messageObj.noError  = false;
      messageObj.title    = errorTitle;
      messageObj.Message  = errorMessage;
      return messageObj;
    }

    function getMessageObject(messageTitle, messageBody){
      var messageObj =  {
                          noError   : false,
                          title     : '',
                          Message   : ''  
                        };

      messageObj.noError    = true;
      messageObj.title      = messageTitle;
      messageObj.Message    = messageBody;
      return messageObj;
    }
  
}]);





