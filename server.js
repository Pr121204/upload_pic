const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer');
const port = 8000;

const ImageModel = require("./image.model");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  next();
});

mongoose.connect("mongodb+srv://priyanshichaturvedi88:udd5c8RgpM7jb2Xr@cluster0.jnzm7hy.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log(err,"It has an err");
  });

//Storage
const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req,file,cb) =>{
        cb(null, file.originalname)
    },
});

const upload = multer({
    storage:Storage
}).single('testImage')

app.get("/",(req, res)=>{
    res.send("upload file");
});

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if (err){
            console.log(err);
        }
        else{
            const newImage = new ImageModel({
                name: req.body.name,
                image:{
                    data:req.file.filename,
                    contentType:'image/png'
                }
            })
            newImage.save().then(()=> res.send("Successfully uploaded")).catch((err) => console.log(err));
        }
    })
})

// app.post('/upload', (req, res) => {
//     upload(req, res, (err) => {
//       if (err) {
//         console.log(err);
//       } else {
//         const newImage = new ImageModel({
//           name: req.body.name,
//           image: {
//             data: fs.readFileSync(req.file.path),
//             contentType: 'image/png'
//           }
//         });
//         newImage.save()
//           .then(() => res.send('Successfully uploaded'))
//           .catch((err) => console.log(err));
//       }
//     });
//   })

app.listen(port, ()=> {
    console.log("Successfully running");
})
