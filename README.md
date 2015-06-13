# Fvalidate
v3.0
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

[Demo](https://jsfiddle.net/hasanhameed89/bLrfzvj6/7/embedded/result/) | [API Docs](https://github.com/hasanhameed89/fvalidate/wiki/Fvalidate-API)

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
/* Bootstrap class */
.text-danger {
	color: #a94442;
	margin-top: 4px;
	margin-bottom: 14px;
	font-size: 11px;
}
</style>
```

###Step 3:
Create or modify existing html form. Keep the following layout format which is compatible with Twitter Bootstrap. Form tag must have id attribute set. And each form element must have a name attribute.
```html
<form id="myform" name="myform">
	<label>UserId:</label><input name="userId" type="text" required minlength="6"  maxlength="20" rule="alpha"/>
	<label>Comfirm UserId:</label><input name="confirm-userId" type="text" required />
	<label>Address:</label><input name="address" type="text" required />
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
	$("input[name=conf-userId]").sameAs($("input[name=userId]"));

	    // define your custom regex rules to jquery element(s)
	$("input[name=address]").rule(/^[a-z0-9-\s]*$/);
});</script>
```


Original Author:
Hasan Hamed
