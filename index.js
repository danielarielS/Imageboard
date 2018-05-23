const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { getImages } = require("./db");
const { saveImages } = require("./db");
const { getPopInfo } = require("./db");
const { saveComment } = require("./db");
const { showMoreImages } = require("./db");
const { saveReply } = require("./db");
const { getReply } = require("./db");
const { upload } = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
//function to fix the dates///
function formatDate(date) {
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
}

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads"));
app.get("/images", function(req, res) {
    getImages()
        .then(function(result) {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(`there was an error in GET/images: ${err}`);
        });
});
app.post("/upload2", function(req, res) {
    // console.log("upload2 is working", req.body);

    if (req.body.url) {
        let title = req.body.title;
        let description = req.body.description;
        let username = req.body.username;
        let url = req.body.url;
        saveImages(url, username, title, description)
            .then((response) => {
                res.json({
                    success: true,
                    image: response.rows[0]
                });
            })
            .catch((err) => {
                console.log(`error in POST/upload: ${err}`);
            });
    } else {
        res.json({
            success: false
        });
    }
});
app.post("/upload", uploader.single("file"), upload, function(req, res) {
    // console.log(req.file, req.body);

    if (req.file) {
        let title = req.body.title;
        let description = req.body.description;
        let username = req.body.username;
        let url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
        saveImages(url, username, title, description)
            .then((response) => {
                res.json({
                    success: true,
                    image: response.rows[0]
                });
            })
            .catch((err) => {
                console.log(`error in POST/upload: ${err}`);
            });
    } else {
        res.json({
            success: false
        });
    }
});
app.get("/popup", (req, res) => {
    // console.log(req.query.id);
    getPopInfo(req.query.id)
        .then((result) => {
            for (var i = 0; i < result.rows.length; i++) {
                result.rows[i].image_date = formatDate(
                    result.rows[i].image_date
                );
            }
            if (result.rows[0].comment_id > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    result.rows[i].comment_date = formatDate(
                        result.rows[i].comment_date
                    );
                }
            }
            // console.log(result.rows);
            res.json({
                success: true,
                image: result.rows
            });
        })
        .catch((err) => {
            console.log(`error in GET/popup: ${err}`);
        });
});
app.get("/reply", (req, res) => {
    getReply(req.query.id)
        .then((result) => {
            for (var i = 0; i < result.rows.length; i++) {
                result.rows[i].created_at = formatDate(
                    result.rows[i].created_at
                );
            }

            res.json({
                success: true,
                data: result.rows
            });
        })
        .catch((err) => {
            console.log(`error in GET/reply: ${err}`);
        });
});
app.post("/reply", (req, res) => {
    console.log(req.body);
    if (req.body) {
        saveReply(
            req.body.replytext,
            req.body.replyuser,
            req.body.replyId
        ).then((result) => {
            console.log(result.rows);
            result.rows[0].created_at = formatDate(result.rows[0].created_at);
            res.json({
                success: true,
                data: result.rows
            });
        });
    } else {
        res.json({
            success: false
        });
    }
});
app.post("/comment", (req, res) => {
    // console.log(req.body);
    if (req.body) {
        saveComment(
            req.body.commenttext,
            req.body.commentuser,
            req.body.commentid
        )
            .then((result) => {
                // console.log(result.rows);
                for (var i = 0; i < result.rows.length; i++) {
                    result.rows[i].created_at = formatDate(
                        result.rows[i].created_at
                    );
                }
                res.json({
                    success: true,
                    data: result.rows
                });
            })
            .catch((err) => {
                console.log(`error in saveComment: ${err}`);
            });
    } else {
        res.json({
            success: false
        });
    }
});
app.get("/more", (req, res) => {
    showMoreImages(req.query.id)
        .then((response) => {
            if (response.rows.length) {
                res.json({
                    success: true,
                    data: response.rows
                });
            } else {
                res.json({
                    success: false
                });
            }
        })
        .catch((err) => {
            console.log(`error in GET/more: ${err}`);
        });
});
app.listen(8080, () => {
    console.log("listening on 8080");
});
