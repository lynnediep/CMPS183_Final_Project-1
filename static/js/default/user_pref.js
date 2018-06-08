// This is the js for the default/index.html view.


var app = function () {

    var self = {};

    Vue.config.silent = false; // show all warnings
    Vue.config.devtools = true;


    self.user_pref_edit_toggle = function (input) {
        self.vue.is_edit_user_name = false;
        if (input === "name") {
            self.vue.is_edit_user_name = true;
        }
    }

    self.get_user_pref = function () {
        $.get(get_user_pref_url, function (data) {
            self.vue.user_pref = data;
        })
    }

    self.update_user_pref = function () {
        $.post(update_user_pref_url, {
            user_first_name: self.vue.user_pref.first_name,
            user_last_name: self.vue.user_pref.last_name,
        })
        self.vue.is_edit_user_name = false;
    }

    self.cancel_user_pref = function () {
        $.get(get_user_pref_url, function (data) {
            self.vue.user_pref = data;
        })
        self.vue.is_edit_user_name = false;
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#user-pref-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            // global variables
            user_pref: {},
            is_edit_user_name: false,
            user_is_editing: null,
        },
        methods: {
            update_user_pref: self.update_user_pref,
            cancel_user_pref: self.cancel_user_pref,
            user_pref_edit_toggle: self.user_pref_edit_toggle,
        }
    });

    self.get_user_pref();

    $('#user-pref-div').removeClass('hidden');
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
    APP = app();
});


