const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/images");
}

function getImages() {
    return db.query("SELECT * FROM images ORDER BY id desc LIMIT 9");
}
function saveImages(url, username, title, description) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [url, username, title, description]
    );
}
function getPopInfo(id) {
    return db.query(
        "SELECT images.description, images.title, images.url, images.username AS image_user, images.created_at AS image_date, images.id AS main_id, comments.comment, comments.image_id, comments.created_at AS comment_date, comments.username AS comment_username, comments.id AS comment_id FROM images LEFT JOIN comments ON images.id=comments.image_id WHERE images.id=$1 ORDER BY comments.created_at desc",
        [id]
    );
}
function saveComment(comment, user, id) {
    return db.query(
        "INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING *",
        [comment, user, id]
    );
}
function showMoreImages(id) {
    return db.query(
        "SELECT * FROM images WHERE id<$1 ORDER BY id DESC LIMIT 9",
        [id]
    );
}
function saveReply(text, user, id) {
    return db.query(
        "INSERT INTO replys (reply, username, comment_id) VALUES ($1, $2, $3) RETURNING *",
        [text, user, id]
    );
}
function getReply(id) {
    return db.query(
        "SELECT * FROM replys WHERE comment_id=$1 ORDER BY id DESC",
        [id]
    );
}
exports.getImages = getImages;
exports.saveImages = saveImages;
exports.getPopInfo = getPopInfo;
exports.saveComment = saveComment;
exports.showMoreImages = showMoreImages;
exports.saveReply = saveReply;
exports.getReply = getReply;
