// This is the js for the default/index.html view.


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

    // Enumerates an array.
    var enumerate = function (v) {
        var k = 0;
        return v.map(function (e) {
            e._idx = k++;
        });
    };

    self.open_uploader = function () {
        $('#gallery_uploader').modal({closable:false}).modal('show');
        self.vue.is_uploading = true;
    };

    self.close_uploader = function () {
        $('#gallery_uploader').modal('hide');
        self.vue.is_uploading = false;
        $("#gallery_file_input").val(""); // This clears the file choice once uploaded.

    };

    self.upload_file = function (event) {
        // Reads the file.
        var input = $('#gallery_file_input')[0];
        var file = input.files[0];

        // TODO read local copy instead of waiting 1 second
        if (file) {
            // First, gets an upload URL.
            console.log("Trying to get the upload url");
            $.getJSON('http://1-dot-grubmeet-205717.appspot.com/grubmeet/uploader/get_upload_url',
                function (data) {
                    // We now have upload (and download) URLs.
                    var put_url = data['signed_url'];
                    var get_url = data['access_url'];
                    console.log("Received upload url: " + put_url);
                    // Uploads the file, using the low-level interface.
                    var req = new XMLHttpRequest();
                    req.addEventListener("load", self.upload_complete(get_url));
                    req.addEventListener("error", self.upload_error);

                    // TODO: if you like, add a listener for "error" to detect failure.
                    req.open("PUT", put_url, true);
                    req.send(file);
                    self.vue.form_description = "";
                });
        }
    };

    self.upload_error = function () {
        console.log("error during upload")
    }

    self.upload_complete = function (get_url) {
        // Hides the uploader div.
        self.close_uploader();
        console.log('The file was uploaded; it is now available at ' + get_url);
        // TODO: The file is uploaded.  Now you have to insert the get_url into the database, etc.
        var image_description = self.vue.form_description;
        self.vue.file_selected = false;
        self.vue.upload_file_name = null;
        setTimeout(function () {
            self.add_image(get_url, image_description);
        }, 1500);
    };

    self.add_image = function (get_url, image_description) {
        $.post(add_image_url, // defined at index.html header.
            {
                image_url: get_url,
                image_description: image_description,
            },
            function (data) {
                self.vue.imagelist.unshift(data.image);
                enumerate(self.vue.imagelist);
            });
    };

    function get_image_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        //passing start_idx and end_idx to /api/get_images through url
        return image_url + "&" + $.param(pp);
        // .param automatically generate a link from objects
    }

    self.get_user_images = function (_idx) {
        // intital list
        $.getJSON(get_image_url(0, 20), {},
            function (data) {
                self.vue.imagelist = data.imagelist;
                enumerate(self.vue.imagelist);
            })
    };

    self.vue = new Vue({
        el: "#gallery-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            imagelist: [],
            is_uploading: false,
            form_description: null,
            file_selected: false,
            upload_file_name: null
        },
        methods: {
            open_uploader: self.open_uploader,
            close_uploader: self.close_uploader,
            upload_file: self.upload_file,
            get_user_images: self.get_user_images,
        }
    });
    // don't show any images initially
    self.get_user_images(-1);
    $("#gallery-div").show();
    $('#gallery_file_input').change(function () {
        self.vue.file_selected = true;
        self.vue.upload_file_name = this.value.replace(/.*[\/\\]/, '');
    });

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () {
    APP = app();
});

