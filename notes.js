var file = $('input[type="file"]').get(0).files[0];
var formData = new FormData();
formData.append('file', file);

inp.files[0] // gives

fileToUpload: {}

<input> v-model="fileToUpload.title"
<input> v-model="fileToUpload.username"
<input> v-model="fileToUpload.desc"
<input>
v-on:change='setFile'
<button>
setFile: function() {
  this.fileToUpload.file = e.target.files[0]
}

upload: function() {
  var formData = new FormData()
  formData.append('file', this.fileToUpload.file)
  formData.append('title', this.fileToUpload.title)
  formData.append('desc', this.fileToUpload.desc)
  formData.append('username', this.fileToUpload.username)

  axios.post('/upload', formData)
}
/// server side ////

var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});


app.post('/upload',uploader.single('file'), (req,res)=>{
  if (req.file) {

  }
})

unshift // puts things first in an array




 /// goes in my
if (wasSuccessful) {
  next()
} else {
  res.sendStatus(500)
}

/// part 3 ////


Vue.component('some-component', {
    /* data, methods, etc. go here */
    data: function() {
      return {
        heading: "blblblba"
      }
    },
    template: "#some-component-tmpl",
    mounted
});
<some-component></some-component>
<script id="some-component-tmpl" text="text/x-template">
<div>
  <h1>{{heading}}</h1>
  <p>something</p>
</div>
</script>


Vue.component('individual-city', {
    props: ['id', 'name', 'country'],
    template: '<span>{{name}}, {{country}}</span>'
});

<individual-city v-bind:id="city.id" v-bind:name="city.name" v-bind:country="city.country"></individual-city>

this.$emit() // fires an event


CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  username VARCHAR(200) NOT NULL,
  comment TEXT NOT NULL,
  image_id INTEGER FOREIGN KEY REFERENCES images(id),
  created_at TIMESTAMP DEFAULT current_timestamp
)

<image-modal v-if="currentImageId"></image-modal>

currentImageId= null // in the parent vue

myArray.push.apply(myArray, myNewArray)

location.hash.slice(1) // gives you the

hashchange is an event
addEventListener

window.addEventListner('hashchange', function() {
    app.currentImageId = location.hash.slice(1)
})

location.hash = "" // do this in the child component

watch: {
    id: function() {
        this.mounted()
    }
}






addEventListener('hashchange', function() {
                var appNxt = app;
                app.currentImageId = location.hash.slice(1);
                app.leftImageId = app.images.filter(function(e, i, a) {
                    return a[i + 1]
                        ? a[i + 1].id === Number(appNxt.currentImageId)
                        : e
                })[0].id;
                app.rightImageId = app.images.filter(function(e, i, a) {
                    return a[i - 1]
                        ? a[i - 1].id === Number(appNxt.currentImageId)
                        : e
                }).reverse()[0].id;
            });





            <div class="title">
                <h3>{{img.title}}</h3>
            </div>
            <div class="text">
                <h4 class="username">{{img.username}}</h4>
                <h4 class="description">{{img.description}}</h4>
            </div>
