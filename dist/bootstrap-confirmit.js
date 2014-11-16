(function($) {
    'use strict';

    // CONFIRMIT CLASS DEFINITION
    // =========================

    var Confirmit = function(element, options) {

        this.init('confirmit', element, options);
    };

    Confirmit.DEFAULTS = {
        confirmBtnClassOnShow: 'fadeInLeft animated',
        confirmBtnClassOnHide: 'fadeOutLeft animated',
        autoCloseOnTime: true,
        autoCloseTime: 4000, 
        autoCloseOnDistance: true,
        autoCloseDistance: 250,
        onShow: function (e) {},
        onHide: function (e) {},
        onConfirm: function (e) {}
    };

    Confirmit.prototype.init = function(type, element, options) {

        this.type = type;
        this.element = element;
        this.$element = $(element).on('click.bs.confirmit', $.proxy(this.toggle, this));
        this.options = this.getOptions(options);

        var $parent = getParent(this.$element);
        $parent.find('.confirmit-confirm').on('click', this.options.onConfirm);
    }

    Confirmit.prototype.getDefaults = function() {

        return Confirmit.DEFAULTS;
    }

    Confirmit.prototype.getOptions = function(options) {

        options = $.extend({}, this.getDefaults(), this.$element.data(), options);
        return options;
    }

    Confirmit.prototype.toggle = function() {

        console.log('toggle');

        var $parent = getParent(this.$element);
        var isActive = $parent.hasClass('open');

        if (!isActive) {

            return this.show();
        } else {

            return this.hide();
        }
    }

    Confirmit.prototype.show = function() {

        console.log('show');

        var self = this;

        if (self.$element.is('.disabled, :disabled')) return;

        var $parent = getParent(self.$element);
        var isActive = $parent.hasClass('open');

        if (!isActive) {

            var relatedTarget = {
                relatedTarget: self.element
            };

            var e = $.Event('show.bs.confirmit', relatedTarget);         
            $parent.trigger(e);
            self.options.onShow.call(self.element, e);

            // User is able to abort process by preventing default behaviour in event listener.
            if (e.isDefaultPrevented()) return;

            self.$element.focus();

            $parent
                .toggleClass('open')
                .trigger('shown.bs.confirmit', relatedTarget);

            var $confirm = $parent.find('.confirmit-confirm');
            $confirm
                .removeClass(self.options.confirmBtnClassOnHide)
                .addClass(self.options.confirmBtnClassOnShow)
                .show();

            if ($confirm.hasClass('animated')) {

                // When the animation is over, remove coresponding classes.
                $confirm.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
                    function () {

                        // Check, whether the button state has changed while the animation.
                        if ($parent.hasClass('open')) {

                            $confirm.removeClass(self.options.confirmBtnClassOnShow);
                        }
                });

            }            

            // Listen for click event to hide component.
            $(document).one('click.bs.confirmit', $.proxy(self.hide, self));

            if (self.options.autoCloseOnDistance === true) {


                // Listen for mouse movements to hide component on given autoCloseDistance.
                $(document).on('mousemove.bs.confirmit', function (e) {

                    var offset = self.$element.offset();
                    var distance = delta2d(offset.left, offset.top, e.pageX, e.pageY);
                
                    if (distance > self.options.autoCloseDistance) {

                        self.hide();
                    }
                });
            }

            if (self.options.autoCloseOnTime === true) {
            
                // Set timeout to hide component on given autoCloseTime.
                self.autoCloseTimer = setTimeout($.proxy(self.hide, self), self.options.autoCloseTime);
            }
        }

        return false;
    }

    Confirmit.prototype.hide = function() {

        console.log('hide');

        var self = this;

        if (self.$element.is('.disabled, :disabled')) return;

        var $parent = getParent(self.$element);
        var isActive = $parent.hasClass('open');

        if (isActive) {

            if (!$parent.hasClass('open')) return;

            var relatedTarget = {
                relatedTarget: self.element
            };

            var e = $.Event('hide.bs.confirmit', relatedTarget);
            $parent.trigger(e);
            self.options.onHide.call(self.element, e);

            // User is able to abort process by preventing default behaviour in event listener.
            if (e.isDefaultPrevented()) return;

            self.$element.blur();

            $parent.removeClass('open').trigger('hidden.bs.confirmit', relatedTarget);

            var $confirm = $parent.find('.confirmit-confirm');

            $confirm.removeClass(self.options.confirmBtnClassOnShow)
                .addClass(self.options.confirmBtnClassOnHide);

            if ($confirm.hasClass('animated')) {

                // When the animation is over, remove coresponding classes.
                $confirm.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
                    function () {

                        // Check, whether the button state has changed while the animation.
                        if (!$parent.hasClass('open')) {

                            $confirm.removeClass(self.options.confirmBtnClassOnHide)
                                .hide();
                        }
                });

            } else {

                // If the element is not animated, just hide it.
                $confirm.hide();
            } 

            if (self.options.autoCloseOnDistance === true) {

                $(document).off('mousemove.bs.confirmit');
            }

            if (self.options.autoCloseOnTime === true){

                clearTimeout(self.autoCloseTimer);
            }
        }

        return false;
    }

    function delta2d(x1, y1, x2, y2) {

        var deltaX = Math.abs(x1 - x2);
        var deltaY = Math.abs(y1 - y2);

        return Math.sqrt( Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }

    function getParent($elem) {

        var selector = $elem.attr('data-target')

        var $parent = selector && $(selector);

        return ($parent && $parent.length) ? $parent : $elem.parent();
    }


    // CONFIRMIT PLUGIN DEFINITION
    // =========================
    function Plugin(option) {

        return this.each(function() {

            var $this = $(this);

            var data = $this.data('bs.confirmit');
            var options = typeof option == 'object' && option;
            var selector = options && options.selector;

            if (!data && option == 'destroy') return;

            if (selector) {

                if (!data) $this.data('bs.confirmit', (data = {}));
                if (!data[selector]) data[selector] = new Confirmit(this, options);

            } else {

                if (!data) $this.data('bs.confirmit', (data = new Confirmit(this, options)));
            }
            if (typeof option == 'string') data[option]();
        });
    }

    var old = $.fn.confirmit;

    $.fn.confirmit = Plugin;
    $.fn.confirmit.Constructor = Confirmit;

    // CONFIRMIT PLUGIN DEFINITION
    // ==========================

    var old = $.fn.confirmit;

    // CONFIRMIT NO CONFLICT
    // ====================

    $.fn.confirmit.noConflict = function() {

        $.fn.confirmit = old;
        return this;
    }

})(jQuery);