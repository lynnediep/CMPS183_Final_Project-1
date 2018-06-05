// This is the js for the default/home.html view.

function showPublicEvents(){
   $('#public-events')[0].scrollIntoView();
}


var app = function () {

    var self = {};

    Vue.config.silent = false; // show all warnings
    Vue.config.devtools = true;

    // Extends an array
    self.extend = function (a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // mimicking Python enumerate
    var enumerate = function (v) {
        var k = 0;
        return v.map(function (e) {
            e._idx = k++;
        });
    };

    function get_memo_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        //passing start_idx and end_idx to /api/get_memos through url
        return memo_url + "?" + $.param(pp);
        // .param automatically generate a link from objects
    }

    self.get_memos = function () {
        // intital list
        $.getJSON(get_memo_url(0, 10), function (data) {
            self.vue.memolist = data.memolist;
            self.vue.logged_in = data.logged_in;
            self.vue.has_more = data.has_more;
            enumerate(self.vue.memolist);
        })
    };

    // show more memos
    self.get_more = function () {
        var num_memos = self.vue.memolist.length;
        $.getJSON(get_memo_url(num_memos, num_memos + 10), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.memolist, data.memolist);
            enumerate(self.vue.memolist);
        });
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#public-events",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            // global variables
            memolist: [],
            has_more: false,
        },
        methods: {
            get_more: self.get_more,

        }
    });

    self.get_memos();
    $('#public-events').show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
APP = app();

