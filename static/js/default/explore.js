// This is the js for the default/index.html view.
var app = function () {

    var self = {};

    Vue.config.silent = true; // show all warnings
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
        return memo_url + "&" + $.param(pp);
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

	self.toggle_post2 = function (post_id, bool) {
        // The submit button to add a track has been added.
		console.log(post_id);
		console.log(bool);
		self.vue.toggle_id = post_id;
		console.log(self.vue.pub);
		self.vue.pub = bool;
		console.log(self.vue.pub);
		self.vue.pub = !self.vue.pub;
		console.log(self.vue.pub);
        $.post(toggle_post_url,
            {
                post_content: self.vue.edit_content,
				is_pub: self.vue.pub,
                id: self.vue.toggle_id
            },
            function (data) {
					//$.web2py.enableElement($("#toggle_post_submit"));
            });
		self.get_memos();
    };

    self.toggle_post = m_id => {
        console.log("toggle_cart");
		console.log(m_id);
        $.post(toggle_post_url,
            {m_id},
            () => {
                self.vue.memolist.forEach(e => {
                    if (e.id === m_id) {
						console.log(e.is_public);
                        e.is_public = !e.is_public;
						self.get_memos();
						console.log(e.is_public);
                    }
                })
            }
        )
    }


    // Complete as needed.
    self.vue = new Vue({
        el: "#explore-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            // global variables
            is_adding_memo: false,
            memolist: [],
            logged_in: false,
            has_more: false,
			pub: null,
			toggle_id: 0,

        },
        methods: {
            get_more: self.get_more,
			get_memos: self.get_memos,
			toggle_post: self.toggle_post,

        }
    });

    self.get_memos();
    $('#explore-div').removeClass('hidden');
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
    APP = app();
});



