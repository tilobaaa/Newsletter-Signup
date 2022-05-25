//jshint esversion:6

const express = require("express");
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

//to use express to see the static pages on the website loke our css and images folder
app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
  const firstName= req.body.name1;
  const lastName = req.body.name2;
  const email = req.body.email;


  const data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/9d4fe6e2a1";

  const options = {
    method: "POST",
    auth: "dolapo:e22195626b492344dae7cb19f64fafb5-us17"
  };

  const request = https.request(url, options, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }


    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});


// API key
// e22195626b492344dae7cb19f64fafb5-us17

// List ID
// 9d4fe6e2a1
