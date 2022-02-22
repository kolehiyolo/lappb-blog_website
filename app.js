// * NODE DEPENDENCIES DECLARATIONS
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const lodash = require("lodash");

// -* Not sure what this does lol
app.use(bodyParser.urlencoded({
  extended: true
}));

// -* I believe this is set to make sure EJS is set
app.set('view engine', 'ejs');

// -* This makes sure that any Express calls for files will always set the public folder as the root
app.use(express.static(__dirname + `/public`));

// * DEMO DATA
const data = require(`${__dirname}/public/javascript/data.js`);

// * EXPRESS ROUTES
// -* Home Route
app.get("/", function (req, res) {
  console.log(`GET request for Home Page`);
  console.log(`\n`);

  // data.Entry.find({},(error,result)=>{
  //   if (error) {
  //     console.log(error); 
  //   } else {
  //     console.log(`Fetched items successfully`);

  //     res.render(`modules/home`, {
  //       sample: data.homeStartingContent,
  //       postsArray: data.posts
  //     });
  //   }
  // });

  let headerCalendarPicker = ``;
  headerCalendarPicker += `<div class="header--navbar--title--current--date-picker">`;
  headerCalendarPicker += `<p></p>`;
  headerCalendarPicker += `<input class="header--navbar--title--current--date-picker--input" id="date" name="date" type="date" value="" max="2050-12-31" min="1950-01-01">`;
  headerCalendarPicker += `</div>`;

  // let entryDBProxy = JSON.stringify(data.posts).replace(/\&#34;/gm,"");
  // let entryDBProxy = JSON.stringify(data.posts);
  // console.log(entryDBProxy); 

  // console.log(JSON.stringify(data.posts));
  res.render(`modules/home`, {
    sample: data.homeStartingContent,
    postsArray: data.posts,
    pageHeader: headerCalendarPicker,
    // entryDB: "what",
    // entryDB: JSON.stringify(data.posts),
    // entryDBProxy: data.posts,
    entryDBProxy: JSON.stringify(data.posts),
  });
});

// -* About Route
app.get("/about", function (req, res) {
  console.log(`GET request for About Page`);
  console.log(`\n`);

  res.render(`modules/about`, {
    sample: data.aboutContent
  });
});

// -* Contact Route
app.get("/contact", function (req, res) {
  console.log(`GET request for Contact Page`);
  console.log(`\n`);

  res.render(`modules/contact`, {
    sample: data.contactContent
  });
});

// -* Compose Route
app.get("/compose", function (req, res) {
  console.log("GET request for Compose Page");
  console.log(`\n`);

  res.render("modules/compose", {
    sample: "",
    pageHeader: `New Post`,
    date: ``,
    // year: ``,
    // month: ``,
    // date: ``
  });
});

app.get("/compose/:date", function (req, res) {
  console.log("GET request for Compose Page");
  console.log(`\n`);

  // const stuff = req.params.date.split(`-`);

  res.render("modules/compose", {
    sample: "",
    pageHeader: `New Post`,
    date: req.params.date,
    // year: stuff[0],
    // month: (stuff[1] < 10) ? `0${stuff[1]}` : stuff[1],
    // date: (stuff[2] < 10) ? `0${stuff[2]}` : stuff[2]
  });
});

// -* Dynamic Post Route
app.get("/post/:postID", function (req, res) {
  console.log(`GET request for Post ${req.params.postID}`);
  console.log(`\n`);

  if (
    req.params.postID < data.posts.length &&
    req.params.postID >= 0 &&
    Number.isInteger(parseInt(req.params.postID))
  ) {
    res.render("modules/post", {
      post: data.posts[req.params.postID]
    });
  } else {
    res.render("modules/post", {
      post: {
        title: "Error",
        body: `Post ${req.params.postID} Not Found`
      }
    });
  }
});

// -* POST Compose
app.post("/compose", function (req, res) {
  console.log(`POST request for Compose`);
  console.log(`\n`);

  // const post = {
  //   id: data.posts.length,
  //   date: "2022-02-02",
  //   title: req.body.title,
  //   body: req.body.post,
  //   link: `/post/${data.posts.length}`
  // };

  const saveDate = new Date();
  const reqDate = req.body.date.split("-");
  const stampDate = {
    year: parseInt(reqDate[0]),
    month: parseInt(reqDate[1])-1,
    date: parseInt(reqDate[2])
  }

  const post = {
    _id: data.posts.length,
    title: req.body.title,
    stamp: {
      date: JSON.parse(JSON.stringify(stampDate)),
      time: {
        hour: 6,
        minutes: 0,
        seconds: 0
      }
    },
    posted: {
      date: {
        year: parseInt(saveDate.getFullYear()),
        month: parseInt(saveDate.getMonth()),
        date: parseInt(saveDate.getDate())
      },
      time: {
        hour: parseInt(saveDate.getHours()),
        minutes: parseInt(saveDate.getMinutes()),
        seconds: parseInt(saveDate.getSeconds()),
      }
    },
    content: req.body.post,
    image: "/images/test.img",
    status: "Done"
    // link: `/post/${data.posts.length}`
  };

  post.edited = JSON.parse(JSON.stringify(post.posted));

  console.log(post);
  data.posts.push(post);

  res.redirect("/");
});

// * SERVER LISTENER
// TODO - Make sure to fix the port number
// 5000 - Personal
// 1000 - freeCodeCamp
// 2000 - Frontend Mentor
// 3000 - London App Brewery
app.listen(3011, function () {
  console.log("The server is running on port 3011.")
  console.log(`\n`);
});