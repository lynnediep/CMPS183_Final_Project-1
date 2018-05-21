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

    self.add_memo_button = function () {
        self.vue.is_adding_memo = !self.vue.is_adding_memo;
    };

    self.add_memo = function () {
        $.post(add_memo_url, // defined at index.html header.
            // sends parameters to api/add_memo()
            {
                title: self.vue.form_title,
                memo: self.vue.form_memo,
                datetime: self.vue.form_datetime,
                area: self.vue.form_area,
                allergens: self.vue.form_allergens
            },
            // data is what's returned from api add_memo
            function (data) {
                console.log(data.memo);

                // enableElement allow button to be pressed multiple times
                $.web2py.enableElement($("#add_memo_submit"));
                // unshift adds to beginning of array
                // data.memolist is from api/add_memo()
                self.vue.memolist.unshift(data.memo);
                self.vue.form_title = "";
                self.vue.form_memo = "";
                self.vue.form_datetime = "";
                self.vue.form_area = "";
                self.vue.form_allergens = "";
                self.vue.is_adding_memo = false;
                enumerate(self.vue.memolist);
            });
    };

    self.delete_memo = function (m_idx) {
        $.post(del_memo_url,
            {
                // id is assigned in api/get_memos()
                memo_id: self.vue.memolist[m_idx].id
            },
            function () {

                // splice with 2 parameters: 1 = flag for replace
                // remove memo at m_idx
                self.vue.memolist.splice(m_idx, 1);
                enumerate(self.vue.memolist);
            })
    };

    self.edit_memo = function (m_idx) {
        //self.vue.form_edit_title = self.vue.memolist[m_idx].title;
        //self.vue.form_edit_memo = self.vue.memolist[m_idx].memo;
        $.post(edit_memo_url,
            // sends parameters to api/edit_memo()
            {
                memo_id: self.vue.memolist[m_idx].id,
                title: self.vue.form_edit_title,
                memo: self.vue.form_edit_memo,
                datetime: self.vue.form_edit_datetime,
                area: self.vue.form_edit_area,
                allergens: self.vue.form_edit_allergens
            },
            // data is what's returned from api add_memo
            function (data) {
                // update Vue's memolist
                console.log(data.memo);
                self.vue.memolist[m_idx].title = data.memo.title;
                self.vue.memolist[m_idx].memo = data.memo.memo;
                self.vue.memolist[m_idx].datetime = data.memo.datetime;
                self.vue.memolist[m_idx].area = data.memo.area;
                self.vue.memolist[m_idx].allergens = data.memo.allergens;

                // data.memo is from api/edit_memo()
                self.vue.memolist[m_idx].is_being_edited = false;

                enumerate(self.vue.memolist); //probably unnecessary
            });
    };

    self.init_edit_memo = function (m_idx) {
        // shrink all edit box first
        for (var m in self.vue.memolist) {
            self.vue.memolist[m].is_being_edited = false;
        }
        self.vue.memolist[m_idx].is_being_edited = true;
        self.vue.form_edit_title = self.vue.memolist[m_idx].title;
        self.vue.form_edit_memo = self.vue.memolist[m_idx].memo;
        self.vue.form_edit_datetime = self.vue.memolist[m_idx].datetime;
        self.vue.form_edit_area = self.vue.memolist[m_idx].area;
        self.vue.form_edit_allergens = self.vue.memolist[m_idx].allergens;
    }


    self.toggle_visibility = function (m_idx) {
        $.post(toggle_visibility_url,
            {
                memo_id: self.vue.memolist[m_idx].id
            },
            function (data) {
                self.vue.memolist[m_idx].is_public = data.is_public;
                self.vue.is_public = !self.vue.is_public;
                enumerate(self.vue.memolist); // probably unnecessary
            });
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            // global variables
            is_adding_memo: false,
            memolist: [],
            logged_in: false,
            has_more: false,
            form_title: null,
            form_memo: null,
            form_datetime: null,
            form_area: null,
            form_allergens: null,
            add_pending: false,
            form_edit_title: null,
            form_edit_memo: null,
            form_edit_datetime: null,
            form_edit_area: null,
            form_edit_allergens: null
        },
        methods: {
            add_memo_button: self.add_memo_button,
            add_memo: self.add_memo,
            get_more: self.get_more,
            delete_memo: self.delete_memo,
            edit_memo: self.edit_memo,
            init_edit_memo: self.init_edit_memo,
            toggle_visibility: self.toggle_visibility
        }
    });

    self.get_memos();
    $('#vue-div').show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
    APP = app();
});

