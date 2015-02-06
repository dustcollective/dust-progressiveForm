# Progressive Forms.

## What it does.

## How it works.
The form is given one or more *states* as a data attribute. These states determine which fields are shown based on each field's *onstates* attribute.

So if the form has a state of 'active' and a field has an onstate of 'active' then the field will show, but if the form did not have a state of 'active' the field would now show.

The form changes state based on each field's *triggers*. For example checking a checkbox might add a 'subscribe' state to the form, which would cause fields with an onstate of 'subscribe' to show.

## How to use it.

### Javascript
Javascript-wise, all you need to do is call
	
	$('.myform').progressiveForm();

or if you want you can specify some settings by calling it like this

	$('.myform').progressiveForm({
		'activeClass' : '',
		'inactiveClass' : 'is-hidden'
	});

#### Settings

**activeClass**
The class that will be applied to elements when they are shown.
Default: ''.

**inactiveClass**
The class that will be applied to elements when they are hidden.
Default: 'is-hidden'.

**triggersAttribute**
The attribute you're using in your markup to define the triggers.
Default 'data-triggers'.

**statesAttribute**
The attribute you're using in your markup to define which states the form is in.
Default 'data-states'.

**onStatesAttribute**
The attribute you're using in your markup to define the states an element will show in.
Default 'data-onstates'.

### Markup

#### Triggers
To make the form change state by interacting with a field, you need to add triggers to the field as a data attribute. Triggers are in the form

	{ "focus" : "+active", "blur" : "-active" }
	
where *focus* and *blur* are Javascript events to be bound to the element, and *+active* and *-active* are actions.

Actions are in the form +state, -state, ?state, and =state meaning add, remove, toggle and set respectively. The *state* part is name of the state you want to +/-/?/= on the form, which will in turn activate or deactivate fields according to their onstates attribute.

	<input type="checkbox" data-triggers='{ "change" : "?subscribe" }' />
	
In this example, checking the checkbox toggles the 'subscribe' state on and off.

#### On States
For elements that you only want to appear in specific states, add a JSON list of states to the element as a data attribute.

	<input type="email" data-onstates='["subscribe"]' />

In this example, the email field will become active when the form has *subscibe* as a state. Otherwise it will be inactive.