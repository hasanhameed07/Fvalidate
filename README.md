# Fvalidate
### jQuery based plugin to handle form validations

Front-end Form Validation Is Now Easy:
- Twitter Bootstrap compatible
- Set validation rules for any form field using inline rules (html attributes).
- Ability to use custom regex rules.
- Compare two fields for same value (e.g. email or password confirmation).
- Use API to take the power in your hands.
- Input class changes on error (Better UI).
- Show errors either on field blur or on submission
- Display alerts



###Step 1:
Include jquery.js and fvalidate.js in your header file.
```html
<script type="text/javascript" src="jquery.js" />
<script type="text/javascript" src="fvalidate.js" />
```

###Step 2:
Add some CSS styling.
```html
<style>
/* Fvalidate Styles */
.inp-focus {
	border: 1px solid #73AAD2;
	}
.inp-error {
	border: solid 1px #CC6666;
	}
.err-msg {
	display: none;
	font-size: 0.85em;
	}
</style>
```

###Step 3:
Create or modify existing html form. Keep the following layout format which is compatible with Twitter Bootstrap. Form tag must have id attribute set. And each form element must have a name attribute.
```html
<form id="myform" name="myform">
<div class="control-group">
    <label class="control-label" for="input07">User id:</label>
    <div class="controls">
      <input type="text" class="input-xlarge"  required="yes" minlength="8"  maxlength="20" rule="alpha" name="userid">
      <p class="help-block"></p>
    </div>
</div>

<div class="control-group">
    <label class="control-label" for="input07">User id:</label>
    <div class="controls">
    <input name="conf-userid" type="text" required="yes" /><p class="help-block"></p><span class="err-msg">userid doesn't match</span>
   </div>
</div>
<div class="control-group">
    <label class="control-label" for="input07">User id:</label>
    <div class="controls">
    <input name="address" type="text" required="yes" /><p class="help-block"></p>
    </div>
</div>

    <input type="submit" value="Submit" />
</form>
```
Here we have added following new attributes: required="yes", minlength="8", maxlength="20" and rule="alpha".
We also have also added custom error message which will show when userid doesn't match `<span class="err-msg">userid doesn't match</span>`
Rules allowed are:
- alpha
- numeric
- floating
- alnum,
- alnumhyph
- email


###Step 4:
Finally call javascript.
```javascript
<script type="text/javascript">
$(document).ready(function(){

	$("#myform").Fvalidate();

	    // this will attach the same as validation to both the fields
	$("input[name=conf-userid]").sameAs($("input[name=userid]"));

	    // define your custom regex rules to jquery element(s)
	$("input[name=address]").rule(/^[a-z0-9-\s]*$/);
});</script>
```

###Docs
[API](https://github.com/hasanhameed89/fvalidate/wiki/Fvalidate-API)

Original Author:
Hasan Hamed
