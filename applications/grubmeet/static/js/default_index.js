// This is the js for the default/sidebar.html view.
var app = function () {

    var self = {};
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
    APP = app();
});
