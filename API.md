# Fvalidate API #

## fvalidate(options) ##
A constructor for this plugin. Attach validation to the submit action of Form or it finds the first submit button and attach validation to it's click event.
Note: The form must have id attribute set.
```
$("#login").Fvalidate();
```
Or you can attach to as many forms as you want.
```
$("#login, form#sidebar-login").Fvalidate({alertErrors:false});
```

### Options ###
| **Property** | **Default** | **Description** |
|:-------------|:------------|:----------------|
| alertErrors  | true        | Alert error messages.|
| submitButton | $form.find("input[[type=submit]]:first") OR null | Button to attach validation. By default first submit button is used if exists otherwise form's onsubmit event will be use |
| attrForName  | "name"      | Value of field attribute to use in error messages. |
| focusClass   | ""inp-focus" | Class to use when focused. |
| errorClass   | "inp-error" | Class to use when field is on error. |
| errorMsgClass | "err-msg"   | Class of box to show when error occured. |

## setError(message) ##
Manually set selected (jquery elements) on error.
```
$("#username").setError("Enter Username.");
```

## removeError() ##
Manually remove errors from selected (jquery elements).
```
$("#username").removeError();
```

## showErrors() ##
Show all errors of select form.
```
$("#login").showErrors();
```

## countErrors() ##
Returns the number of errors select form has.
```
var num = $("#login").countErrors();
```

## rule(regex) ##
Set regex rule for the selected (jquery elements).
```
$("#username").rule(/^[a-zA-Z0-9-_\s]*$/));
```

## sameAs(element) ##
Checks for the same value of two fields, if not shows the element which has "errorMsgClass" class (see options above).
```
$("#confpword").sameAs($("#password"));
```


## changeClass(from,to) ##
Chhanges the existing class to another class.
```
$("#address").changeClass('inp-error', 'inp-focus');
```


Note: All above functions returns the previous selected jquery element, So chaining can be done. For example:
```
$("#username").setError("Enter Username.").removeError();
```