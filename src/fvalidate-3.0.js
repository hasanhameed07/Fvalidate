/**
 * Fvalidate v3.0 - A validation plugin for jQuery
 * Copyright (C) 2010  Hasan Hameed
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Fvalidate v3.0.0
 * by Hasan Hameed - hasanhameed89@gmail.com
 *
 * Project Url: https://github.com/hasanhameed89/Fvalidate/
 */


(function($) {

	var _errors = [],
	_rules = [],
	_sameAs = [];

	$.fn.Fvalidate = function(settings)
	{
		var $form = $(this),
		formId = $form.attr("id"),
		$fields = $form.find("input, textarea, select").filter(":not(:submit)"),

		defaults = {
			alertErrors:	false,												/* alert error messages */
			showErrorsOnSubmitOnly: false,					
			submitButton:	$form.find("input[type=submit]:first") || null,		/* button to attach validation if not null */
			attrForName:	"name",												/* define field attribute to use as field name in error message (chnge only when other one is defined) */
			focusClass:		"inp-focus",										/* class to use when focused */
			errorClass: 	"inp-error",										/* error class name */
			errorMsgClass:	"text-danger",										/* error message class name */
			onSuccess: 		function(){ return true; },							/* success callback  */
			onError: 		function(){},										/* error callback with errors as argument */
		},
		options = $.extend(defaults, settings);

		_errors[formId] = [];


		$fields.focus(function() {
			$(this).addClass(options.focusClass);
		});
		$fields.blur(function() {
		        _validate(this);
			$(this).removeClass(options.focusClass);
		});

		$fields.keyup(function(){
			_validate(this);
		});


		if(options.submitButton==null)
			$form.submit(function(){
				if(!_validateForm()) return false;	/* Bind Validation on form submit */
			});
		else
			options.submitButton.click(function(){
				if(!_validateForm()) return false;	/* Bind Validation on button */
			});

		/**
		 * _validate - Form validation on submit
		 * @return boolean
		 */
		function _validateForm(){
			$fields.each(function(){
				_validate(this);	/* Validate each field */
			});
			/* Focus first error field */
			if($form.countErrors()>0){
				$form.showErrors();
				/* TODO: focus first element
				var x;
				for(x in _errors[formId]){
					_errors[formId][x]['elem'].focus(); break;
				}*/
				var errors = $form.getErrors();
				options.onError(errors);
				return false;
			}
			return options.onSuccess();
		};

		/**
		 * _validate - Input field validation
		 */
		function _validate(obj)
		{
			var $input = $(obj),
			Name = $input.attr(options.attrForName),
			val = $input.val();

			/* required => yes */
			if($input.attr("required")){
				if($input.is(":checkbox") || $input.is(":radio"))
					if (!$input.attr('checked') || !$input.is(':checked')){
						$input.setError('Please select '+Name); 
						return false; /* on error */
					}
				if(val=='' || val==undefined){
					$input.setError(Name + ' is required.'); 
					return false;
				}
			}

			if (val=='')
				return false;

			/* Check for rules */
			var mask = _rules[Name] || $input.attr("rule") || false;
			if(mask){
			    var maskm = '';
				switch(mask){
				case 'alpha':mask = /^[a-zA-Z\s]*$/; maskm=' must be Alphabets only.'; break;
				case 'numeric': mask = /^[0-9\s]*$/; maskm=' must be Numbers.'; break;
				case 'floating': mask = /^[0-9-\.\s]*$/;  maskm=' must be Floating numbers.'; break;
				case 'alnum': mask = /^[a-zA-Z-0-9\s]*$/;  maskm=' must be Alphabets or numbers.'; break;
				case 'alnumhyph': mask = /^[a-zA-Z0-9-\s]*$/;  maskm=' must be Alphabets or numbers (including hyphens).'; break;
				case 'email': mask = /^[^@\s<&>]+@([-a-z0-9]+\.)+[a-z]{2,}$/i; maskm='is not valid e-mail address.'; break;
				default:
				    maskm='is invalid.';
				}
				if(!mask.test(val) ){
					$input.setError(Name+''+maskm); return false;
				}
			}

			/* Check for min. length */
			var minlen = $input.attr("minlength") || 0;
			if(minlen){
				var thislen = val.length;
				if(minlen>thislen){
					$input.setError('Length of '+Name+' must be greater than '+minlen); return false;
				}
			}

			/* Check for Same as value against another element */
			var elem = _sameAs[Name] || false;
			if(elem){
				if( elem.val()!==val ){
					$input.setError(elem.attr('name')+' does not match.');
					$input.nextAll('.'+options.errorMsgClass).slideDown(); return false;
				}
				$input.nextAll('.'+options.errorMsgClass).slideUp();
			}
			/* No Error */
			$input.removeError();
		};

		var methods = {

			/* Set error
			 * @param string [form id], string [message]
			 */
			setError:	function(msg) {
				var name = $(this).attr("name"),
				fid = $(this).parents("form:last").attr("id");
				_errors[fid][name] = [];
				_errors[fid][name]['elem'] = this;
				_errors[fid][name]['msg'] = msg; 
				if (!options.showErrorsOnSubmitOnly) {

					if(this.parent().hasClass('form-group')) {
					    //this.next('i').remove();
						this.parent('.form-group').addClass('has-error');
					}
					var msgElem = '<p class="'+options.errorMsgClass+'">'+msg+'</p>';
					if (this.next('.'+options.errorMsgClass).length<1) {
						if (this.attr('type')=='checkbox' || this.attr('type')=='radio')
							this.before(msgElem);
						else
							this.after(msgElem);
					} else if (this.next('.'+options.errorMsgClass).text()!=msg) {
						this.next('.'+options.errorMsgClass).html(msgElem);
					}
					return this.changeClass(options.focusClass,options.errorClass);
				}
				else {
					return this;
				}
			},

			/* Remove error */
			removeError:	function() {
				var fid = $(this).parents("form:last").attr("id");
				delete _errors[fid][$(this).attr("name")];
				//var ico = $(this).nextAll('.ui-icon-notice');
				//ico.fadeOut('Slow',function(){ico.remove();});
				this.parent('.form-group').removeClass('has-error');
				$(this).next('.'+options.errorMsgClass).remove();
				return this.changeClass(options.errorClass,options.focusClass);
			},

			/* showErrors - Show errors */
			getErrors:	function() {
				return _errors[formId];
			},

			/* showErrors - Show errors */
			showErrors:	function() {

				var fid = $(this).attr("id");
				if(options.alertErrors){
					var s = '';
					for(x in _errors[fid])
						s += "" + _errors[fid][x]['msg'] + '\n';
					alert(s, 'Please Correct Mistakes');
				}
				
				if (!options.showErrorsOnSubmitOnly) {
					for(x in _errors[fid]) {
						var $elem = $(_errors[fid][x]['elem']);
						if ($elem.next('.'+options.errorMsgClass).length<1 && $elem.prev('.'+options.errorMsgClass).length<1) {
							var msgElem = '<p class="'+options.errorMsgClass+'">'+_errors[fid][x]['msg']+'</p>';
							$elem.changeClass(options.focusClass,options.errorClass);
							if ($elem.attr('type')=='checkbox' || $elem.attr('type')=='radio')
								$elem.before(msgElem);
							else
								$elem.after(msgElem);
						}
					}
				}
				return this;
			},

			/* countErrors - Get no. of errors */
			countErrors:	function() {
				var c = 0,x;
				for(x in _errors[$(this).attr("id")])
					c++;
				return c;
			},

			/* rule - adds new rule for jquery element(s) to '_rules' array
			 * @param regex or 'alpha','numeric','email'
			 */
			rule:	function(mask) {
				this.each(function(){
					_rules[$(this).attr('name')] = mask;
				});
				return this;
			},

			/* sameAs - Check for same field values
			 * @param single jquery element
			 */
			sameAs:	function(elem) {
				_sameAs[$(this).attr('name')] = elem;
				return this;
			},

			changeClass:	function(from,to) {
				return this.removeClass(from).addClass(to);
			}
		};

		$.each(methods, function(i) {
			$.fn[i] = this;
		});

		return $form;
	};
})(jQuery);