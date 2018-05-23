(function() {
    Vue.component("reply-component", {
        props: ["id"],
        template: "#reply-template",
        data: function() {
            return {
                replyArray: [],
                reply: {},
                showReply: "",
                currentCommentId: ""
            };
        },
        mounted: function() {
            var app = this;
            axios
                .get("reply", {
                    params: {
                        id: this.id
                    }
                })
                .then(function(response) {
                    if (response.data.success) {
                        console.log(response.data);
                        response.data.data.forEach(function(item) {
                            item.text = item.reply;
                            item.user = item.username;
                            item.date = item.created_at;
                            app.replyArray.unshift(item);
                            // console.log(app.replyArray);
                        });
                    }
                })
                .catch(function(err) {
                    console.log("error in GET/reply", err);
                });
        },
        methods: {
            exit: function() {
                this.$emit("exit");
            },
            saveReply: function() {
                var app = this;
                app.reply.replyId = app.id;
                // console.log(app.reply);
                axios
                    .post("reply", app.reply)
                    .then(function(response) {
                        // console.log(response.data);
                        if (response.data.success) {
                            // console.log(response.data);
                            response.data.data.forEach(function(item) {
                                app.reply.text = item.reply;
                                app.reply.user = item.username;
                                app.reply.date = item.created_at;
                                app.replyArray.unshift(app.reply);
                            });
                        }
                    })
                    .catch(function(err) {
                        console.log("error in POST/reply", err);
                    });
            }
        }
    });
    Vue.component("some-component", {
        props: ["id"],
        template: "#some-template",
        // popArray: [],
        data: function() {
            return {
                file: "",
                title: "",
                description: "",
                username: "",
                date: "",
                comment: {},
                commentArray: [],
                showReply: "",
                replyArray: [],
                reply: {},
                currentCommentId: ""
            };
        },
        methods: {
            exit: function() {
                this.currentCommentId = "";
            },
            close: function(e) {
                location.hash = "";
                this.$emit("close");
            },
            left: function() {
                this.$emit("left");
            },
            right: function() {
                this.$emit("right");
            },

            savecom: function() {
                var app2 = this;
                app2.comment.commentid = app2.id;
                console.log(app2.comment);
                axios
                    .post("/comment", app2.comment)
                    .then(function(response) {
                        // console.log("new log", response.data.data[0]);
                        if (response.data.success) {
                            // app2.currentCommentId = response.data.data[0].id;
                            // console.log(response.data);
                            app2.comment.comment_id = response.data.data[0].id;
                            app2.comment.comment =
                                response.data.data[0].comment;
                            app2.comment.comment_username =
                                response.data.data[0].username;
                            app2.comment.comment_date =
                                response.data.data[0].created_at;
                            // app2.comment.comment_id =
                            //     response.data.data[0].commentid;
                            app2.commentArray.unshift(app2.comment);
                            console.log(app2.commentArray);
                        }
                    })
                    .catch(function(err) {
                        console.log("error in POST/comment", err);
                    });
            },
            getImage: function() {
                var app = this;
                axios
                    .get("/popup", {
                        params: {
                            id: this.id
                        }
                    })
                    .then(function(resp) {
                        // console.log(resp.data);
                        if (resp.data.success) {
                            app.file = resp.data.image[0].url;
                            app.title = resp.data.image[0].title;
                            app.description = resp.data.image[0].description;
                            app.username = resp.data.image[0].image_user;
                            app.date = resp.data.image[0].image_date;
                            app.commentArray = resp.data.image;
                        }
                    })
                    .catch(function(err) {
                        console.log("there was an error in popup", err);
                    });
            }
        },

        watch: {
            id: function() {
                this.getImage();
            }
        },
        mounted: function() {
            this.getImage();
        }
    });

    new Vue({
        el: "main",
        data: {
            uploadArray: [],
            fileToUpload: {},
            currentImageId: location.hash.slice(1),
            lastId: "",
            hidebutton: true,
            rightImageId: "",
            leftImageId: ""
        },

        mounted: function() {
            var app = this;
            window.addEventListener("hashchange", function() {
                app.currentImageId = location.hash.slice(1);
            });
            this.getImages();
        },

        methods: {
            left: function() {
                var app = this;
                this.leftImageId = this.uploadArray.filter(function(e, i, a) {
                    return a[i + 1]
                        ? a[i + 1].id === Number(app.currentImageId)
                        : e;
                })[0].id;
                location.hash = this.leftImageId;
                // this.currentImageId = this.leftImageId;
            },
            right: function() {
                var app = this;
                app.rightImageId = app.uploadArray
                    .filter(function(e, i, a) {
                        return a[i - 1]
                            ? a[i - 1].id === Number(app.currentImageId)
                            : e;
                    })
                    .reverse()[0].id;
                location.hash = this.rightImageId;
                // this.currentImageId = this.rightImageId;
            },
            getImages: function() {
                var app = this;
                axios.get("/images").then(function(response) {
                    app.uploadArray = response.data;
                    app.lastId = response.data[8].id;
                });
            },
            showMore: function() {
                console.log(this.lastId);
                var app = this;
                axios
                    .get("/more", {
                        params: {
                            id: app.lastId
                        }
                    })
                    .then(function(response) {
                        if (response.data.success) {
                            // console.log("more is working");
                            response.data.data.forEach(function(item) {
                                app.uploadArray.push(item);
                                app.lastId =
                                    app.lastId - response.data.data.length;
                            });
                            // app.uploadArray.push(response.data);
                        } else {
                            console.log("problem in showMore");
                            app.hidebutton = false;
                        }
                    });
            },
            setFile: function(e) {
                this.fileToUpload.file = e.target.files[0];
            },
            upload: function() {
                var app = this;
                if (app.fileToUpload.url) {
                    // var formData = new FormData();
                    // formData.append("url", this.fileToUpload.url);
                    // formData.append("title", this.fileToUpload.title);
                    // formData.append(
                    //     "description",
                    //     this.fileToUpload.description
                    // );
                    // formData.append("username", this.fileToUpload.username);
                    axios
                        .post("/upload2", app.fileToUpload)
                        .then(function(response) {
                            if (response.data.success) {
                                app.uploadArray.unshift(response.data.image);
                            }
                        })
                        .catch(function(err) {
                            console.log("there was an error in upload", err);
                        });
                } else {
                    var formData = new FormData();
                    formData.append("file", this.fileToUpload.file);
                    formData.append("title", this.fileToUpload.title);
                    formData.append(
                        "description",
                        this.fileToUpload.description
                    );
                    formData.append("username", this.fileToUpload.username);
                    axios
                        .post("/upload", formData)
                        .then(function(response) {
                            if (response.data.success) {
                                app.uploadArray.unshift(response.data.image);
                            }
                        })
                        .catch(function(err) {
                            console.log("there was an error in upload", err);
                        });
                }
            },
            close: function() {
                console.log("closing pop");
                this.currentImageId = null;
            }
        }
    });
})();

// axios.post("/profile", {
//     firstName: this.firstName
// })
