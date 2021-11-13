const client = require("./client");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const http = require("http")
const axios = require("axios")
const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid');

///////////////////////////////////////////////////////////////////////////////////////////////
const app = express();
///////////////////////////////////////////////////////////////////////////////////////////////

var authen_service = 'http://localhost:5048'
var linkToOrder = 'http://localhost:8080'

// app.set("views",path.join(__dirname,"views"));
// app.set("view engine","hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
const fiveMin = 1000 * 60 * 5;
const threeSec = 1000 * 3;
app.use(session({
    secret: "smm",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: fiveMin }
}))

app.set('view engine', 'ejs')
app.use(express.static("public"))



///////////////////////////////////////////////////////////////////////////////////////////////
app.get("/dev", (req, res) => {
    let Owner = {
        store_name: "mike"
    }
    console.log(Owner)
    client.getAllProduct(Owner, (err, data) => {
        if (!err) {
            // console.log(data)
            console.log("home success")
            res.render("list", {
                storeName: "mike",
                newList: data.product,
                linkToOrder: linkToOrder
            });
            // res.send(data)
        }
    });
})


app.get("/", async(req, res) => {
    let token_ = req.cookies.token_cookie;
    if (token_) {
        // console.log(token);
        const data_set = JSON.stringify({
            token: token_
        });
        console.log(data_set)
        const options = {
            headers: { 'Content-Type': 'application/json' }
        };
        const resp = await axios.post(authen_service + '/get_user', data_set, options);
        console.log(resp.data)
            // res.send(resp.data)
        if (resp.data.username) {
            let Owner = {
                store_name: resp.data.username
            }
            console.log(Owner)
            client.getAllProduct(Owner, (err, data) => {
                if (!err) {
                    // console.log(data)
                    console.log("home success")
                    res.render("list", {
                        storeName: resp.data.username,
                        newList: data.product,
                        linkToOrder: linkToOrder
                    });
                    // res.send(data)
                }
            });
        } else {
            console.log('token_not_match')
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})


app.post("/product", async(req, res) => {
    let token_ = req.cookies.token_cookie;
    if (token_) {
        // console.log(token);
        const data_set = JSON.stringify({
            token: token_
        });
        console.log(data_set)
        const options = {
            headers: { 'Content-Type': 'application/json' }
        };
        const resp = await axios.post(authen_service + '/get_user', data_set, options);
        console.log(resp.data)
        console.log("user " + resp.data.username)
            // res.send(resp.data)
        if (resp.data.username) {
            console.log('add_product')
            let newProduct = {
                product_name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                qty: req.body.qty,
                image: req.body.image,
                store_name: resp.data.username
            }
            console.log(newProduct)
            client.insert(newProduct, (err, data) => {
                if (err) throw err;
                // console.log("success", data);
                console.log(req.session.setname)
                res.redirect("/");
            })
        } else {
            console.log('token_not_match')
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})


app.post("/updateproduct", async(req, res) => {
    let token_ = req.cookies.token_cookie;
    if (token_) {
        // console.log(token);
        const data_set = JSON.stringify({
            token: token_
        });
        console.log(data_set)
        const options = {
            headers: { 'Content-Type': 'application/json' }
        };
        const resp = await axios.post(authen_service + '/get_user', data_set, options);
        console.log(resp.data)
        console.log("user " + resp.data.username)
            // res.send(resp.data)
        if (resp.data.username) {
            console.log('update_product')

            let newProduct = {
                _id: req.body._id,
                product_name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                qty: req.body.qty,
                image: req.body.image,
                store_name: resp.data.username
            }
            client.update(newProduct, (err, data) => {
                if (err) {
                    throw err
                };
                // console.log("success", data);
                console.log("updated")
                res.redirect("/");
            })
        } else {
            console.log('token_not_match')
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})

app.post("/removeproduct", async(req, res) => {
    let token_ = req.cookies.token_cookie;
    if (token_) {
        // console.log(token);
        const data_set = JSON.stringify({
            token: token_
        });
        console.log(data_set)
        const options = {
            headers: { 'Content-Type': 'application/json' }
        };
        const resp = await axios.post(authen_service + '/get_user', data_set, options);
        console.log(resp.data)
        console.log("user " + resp.data.username)
            // res.send(resp.data)
        if (resp.data.username) {
            console.log('remove_product')

            let idProduct = {
                _id: req.body._id
            }

            client.remove(idProduct, (err, data) => {
                if (err) throw err;
                // console.log("remove success", data);
                res.redirect("/");
            })
        } else {
            console.log('token_not_match')
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})


///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////


app.get("/set_cookie", (req, res) => {
    var a = 'pp'
    res.cookie('token_cookie', a, { maxAge: oneDay / 48 });
    console.log('set_cookie')
    res.send('keep_cookie')
})

app.get("/get_cookie", (req, res) => {
    let token = req.cookies.token_cookie;
    console.log(token)
    res.send(token)
})

app.get("/check_cookie", async(req, res) => {
    // let token_ = 'mike'
    let token_ = req.cookies.token_cookie;
    if (token_) {
        console.log(token_)
        const data_set = JSON.stringify({
            token: token_
        });
        console.log(data_set)
        const options = {
            headers: { 'Content-Type': 'application/json' }
        };

        const resp = await axios.post(authen_service + '/get_user', data_set, options);
        console.log(resp.data)
        res.send(resp.data)
    } else {
        console.log('gone')
        res.send('gone')
    }
})

app.get("/login", (req, res) => {
    res.clearCookie("token_cookie");
    res.render("login_dynamics", {
        direction: '/send_login',
        method_form: 'POST'
    });
})

app.get("/regis", (req, res) => {
    res.render("register_dynamics", {
        direction: '/send_regis',
        method_form: 'POST'
    });
})

app.get("/logout", (req, res) => {
    console.log('logout')
    res.clearCookie("token_cookie");
    console.log(req.cookies.token_cookie)
    res.render("logout")
})

app.post("/send_regis", async(req, res) => {
    console.log(req.body.username)
    console.log(req.body.password)
    var token_ = uuidv4()
    const data_set = JSON.stringify({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        token: token_
    });
    console.log(data_set)
    const options = {
        headers: { 'Content-Type': 'application/json' }
    };

    const resp = await axios.post(authen_service + '/test_adduser', data_set, options);
    console.log(resp.data)
    if (resp.data.code === 'ER_DUP_ENTRY') {
        res.render("not_success", { err_message: 'user is existing' })
    } else {
        res.redirect('/')
    }

})

app.post("/send_login", async(req, res) => {
    console.log(req.body.username)
    console.log(req.body.password)
    var token_ = uuidv4()
    const data_set = JSON.stringify({
        username: req.body.username,
        password: req.body.password,
        token: token_
    });
    console.log(data_set)
    const options = {
        headers: { 'Content-Type': 'application/json' }
    };

    const resp = await axios.post(authen_service + '/test_login', data_set, options);
    console.log(resp.data)
    if (resp.data.token === token_) {
        console.log('yes')
        res.cookie('token_cookie', token_, { maxAge: oneDay / 48 });
        console.log('set_cookie')
    }
    if (resp.data === 'cannot login') {
        res.render("not_success", { err_message: 'Fail to login' })
    } else {
        res.redirect('/')
    }
})


app.post('/get_pass', async function(req, res) {
    console.log(req.body.username)
    console.log(req.body.password)
    const data_set = JSON.stringify({ answer: req.body.username });

    const options = {
        headers: { 'Content-Type': 'application/json' }
    };

    const resp = await axios.post(authen_service + '/test_post', data_set, options);
    console.log(resp.data)
    res.send(resp.data)
})

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////




const PORT = process.env.PORT || 5047;
app.listen(PORT, () => {
    console.log("Server running at : http://localhost:%d", PORT);
});