/**
 * Fvalidate v1.0 - A validation plugin for jQuery
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
 * Fvalidate v1.0.1
 * by Hasan Hameed - theculpritz@hotmail.com
 *
 * http://code.google.com/p/fvalidate/
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
			alertErrors:	true,												/* alert error messages */
			submitButton:	$form.find("input[type=submit]:first") || null,		/* button to attach validation if not null */
			attrForName:	"name",												/* define field attribute to use as field name in error message (chnge only when other one is defined) */
			focusClass:		"inp-focus",										/* class to use when focused */
			errorClass: 	"inp-error",										/* error class name */
			errorMsgClass:	"err-msg"											/* error message class name */
		},
		options = $.extend(defaults, settings);

		_errors[formId] = [];


		$fields.focus(function() {
			$(this).addClass(options.focusClass);
		});
		$fields.blur(function() {
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
				var x;
				for(x in _errors[formId]){
					_errors[formId][x]['elem'].focus(); break;
				}
				return false;
			}
			return true;
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
			if($input.attr("required")=='yes'){
				if($input.is(":checkbox") || $input.is(":radio"))
					if (!$input.attr('checked') || !$input.is(':checked')){
						$input.setError('Please select '+Name); return false; /* on error */
					}
				if(val=='' || val==undefined){
					$input.setError('Please type '+Name); return false;
				}
			}

			/* Check for rules */
			var mask = _rules[Name] || $input.attr("rule") || false;
			if(mask){
				switch(mask){
				case 'alpha':mask = /^[a-zA-Z\s]*$/; break;
				case 'numeric': mask = /^[0-9\s]*$/; break;
				case 'floating': mask = /^[0-9-\.\s]*$/; break;
				case 'alnum': mask = /^[a-zA-Z-0-9\s]*$/; break;
				case 'alnumhyph': mask = /^[a-zA-Z0-9-\s]*$/; break;
				case 'email': mask = /^[^@\s<&>]+@([-a-z0-9]+\.)+[a-z]{2,}$/i; break;
				}
				if(!mask.test(val) ){
					$input.setError('Invalid '+Name); return false;
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
				return this.changeClass(options.focusClass,options.errorClass);
			},

			/* Remove error */
			removeError:	function() {
				var fid = $(this).parents("form:last").attr("id");
				delete _errors[fid][$(this).attr("name")];
				if(this.hasClass('inp-error'))
					return this.changeClass(options.errorClass,options.focusClass);
			},

			/* showErrors - Show errors */
			showErrors:	function() {
				if(options.alertErrors){
					var s = 'Following errors are occured:', fid = $(this).attr("id");
					for(x in _errors[fid])
						s += "\n " + _errors[fid][x]['msg']+'.';
					alert(s);
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