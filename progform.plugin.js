(function($){

	var ProgressiveForm = function(element, options) {
		var self = $(element);
		var _this = this;

		var settings = $.extend({
			'activeClass' : '',
			'inactiveClass' : 'is-hidden',
			'triggersAttribute' : 'data-triggers',
			'statesAttribute' : 'data-states',
			'onStatesAttribute' : 'data-onstates'
		}, options || {});

		this.init = function() {
			var _this = this;

			// go through the elements in the form and bind the events.
			_this.bindTriggers();

			// do an update to show/hide any elements depending on the initial
			// state.
			_this.updateForm();

			return _this;
		}

		/**
		Elements might have a data-trigger attribute in the form { "event1",
		"acton1", "event2" : "acton2" }. This function goes through these and
		binds the events to actual js events, triggering the actions.
		**/
		this.bindTriggers = function() {
			var _this = this;

			// any elements within the form can have triggers and states, so
			// loop through each element...
			self.find('*').each(function(i, element) {

				var triggers = _this._get($(element), settings.triggersAttribute);

				// check if it has triggers...
				if (triggers != null) {

					// and bind the events to actions.
					$.each(triggers, function(k, v) {

						$(element).on(k, function() {
							_this.parseAction(v);
							_this.updateForm();
						})

					});
				} else {
					// element does not have any triggers, so do nothing.
				}

			});

			return _this;
		}

		/**
		Actions can take the form +state, -state, =state and ?state, meaning
		add, remove, set, and toggle respectively. This function interprets
		the action and calls the appropriate function.
		**/
		this.parseAction = function(action) {
			var _this = this;

			var method = action.substr(0, 1);
			var state = action.substr(1);

			switch (method) {
				case '+':
					_this.addState(state);
					break;
				case '-':
					_this.removeState(state);
					break;
				case '=':
					_this.setState(state);
					break;
				case '?':
					_this.toggleState(state);
					break;
				default:
					console.log(method + ' is not a valid method. Must be +, -, =, or ?.');
			}

			return _this;
		}

		/**
		Adds a state to the form's data-states attribute.
		**/
		this.addState = function(state) {
			var states = _this.getStates();
			states.push(state);
			self.attr(settings.statesAttribute, JSON.stringify(states));
		}

		/**
		Removes a state to the form's data-states attribute.
		**/
		this.removeState = function(state) {
			var states = _this.getStates();
			states.pop(state);
			self.attr(settings.statesAttribute, JSON.stringify(states));
		}

		/**
		Clears the form's data-states attribute, and replaces it with this
		new state.
		**/
		this.setState = function(state) {
			var states = [];
			states.push(state);
			self.attr(settings.statesAttribute, JSON.stringify(states));
		}

		/**
		Adds or removes a state from the form's data-states depending on if it's
		already there or not.
		**/
		this.toggleState = function(state) {
			var _this = this;

			var states = _this.getStates();

			if ($.inArray(state, states) != '-1') {
				_this.removeState(state);
			} else {
				_this.addState(state);
			}

			return _this;
		}

		/**
		Goes through the elements in the form with specific onstates and shows
		or hides them according to the form's data-states.
		**/
		this.updateForm = function() {
			var _this = this;

			// for each element in the form...
			self.find('*').each(function(i, element) {

				// get its onstates...
				var onStates = _this._get($(element), settings.onStatesAttribute);

				if (onStates != null) {

					var currentStates = _this.getStates();

					// and for each onstate...
					$.each(onStates, function(i, state) {

						// if it's in the form's current state...
						if ($.inArray(state, currentStates) != '-1') {

							// show the element...
							_this._show($(element));

							// and stop looping to prevent it from being hidden
							// again.
							return false;
						} else {

							// if it is not in the form's current state, hide
							// then element.
							_this._hide($(element));
						}
					});

				} else {
					// no onstates set, so do nothing.
				}

			});

			return _this;
		}

		/**
		Adds/removes classes to show the element.
		**/
		this._show = function(elem) {
			elem.addClass(settings.activeClass).removeClass(settings.inactiveClass);
		}

		/**
		Adds/removes classes to hide the element.
		**/
		this._hide = function(elem) {
			elem.addClass(settings.inactiveClass).removeClass(settings.activeClass);
		}

		/**
		Gets the data-states of the form.
		**/
		this.getStates = function() {
			return this._get(self, settings.statesAttribute);
		}

		/**
		Generic get function to get data attributes, parse them and return them.
		**/
		this._get = function(elem, attr) {
			if (elem.attr(attr)) {
				return $.parseJSON(elem.attr(attr));
			} else {
				return null;
			}
		}

	};

	$.fn.progressiveform = function(options) {
		return this.each(function() {
			var element = $(this);

			// Return early if this element already has a plugin instance
			if (element.data('progressiveform')) return;

			// pass options to plugin constructor
			var progressiveform = new ProgressiveForm(this, options);

			progressiveform.init();

			// Store plugin object in this element's data
			element.data('progressiveform', progressiveform);
		});
	};
})(jQuery);
