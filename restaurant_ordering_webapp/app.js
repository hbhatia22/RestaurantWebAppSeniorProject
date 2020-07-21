// let {PythonShell} = require('python-shell')

const bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer= require("express-sanitizer"),
mongoose= require("mongoose"),
express = require("express"),
passport= require("passport"),
multer = require("multer"),
session = require("express-session"),
mongoStore = require("connect-mongo")(session),
Order = require("./models/order"),
flash = require("connect-flash"),
csrf = require("csurf"),
csrfProtection = csrf(),
Cart = require("./models/cart"),
Comment = require("./models/comments"),


// eel = require("./public/javascripts/eel.js")


// storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb("null", './uploads/');
//     },
//     filename: function(req,file,cb){
//         cb("null", new Date().toISOString()+ file.originalname);
//     }


// }),
app=express()

upload = multer({dest:'uploads/'}),
LocalStrategy= require ("passport-local"),
User     = require("./models/user"),
Table    = require("./models/table"),
Category = require("./models/category"),
Product  = require("./models/product");
// file filter
fileFilter = (req,file,cb) =>{
    //ACCEPT JPEG, PNG
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null, true);
    // Reject else
    }   else {
        cb(null, false);
    }

};



// Enabeling auto refresh
// server = require('http').Server(app),
// io = require('socket.io')(server);
// server.listen(80);
var livereload = require('livereload');
var server = livereload.createServer();
server.watch(__dirname + "/kitchen");



// Category.create({ 
//                     _id: new mongoose.Types.ObjectId(),
//                     name:"Subs"
//                 }, function(err,newCat){
//     if(err){
//         console.log (err);
//     } else {
//         console.log(newCat);
//     }

// });
//App Config
mongoose.connect('mongodb://localhost/restaurant_ordering_webApp', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
// make uploads file available for the app
app.use('/uploads', express.static('uploads'));
//Enable using sessions for security
app.use(session({
                    secret:"it's a secret", 
                    resave:false, 
                    saveUninitialized: false,
                    store: new mongoStore({ mongooseConnection: mongoose.connection }),
                    cookie: { maxAge: 1800000*60*1000 }
                }

        
        ));
//Enable Using flash messages, NOTE: SHOULD BE AFTER app.use ("session")
app.use(flash());

//ENABELING SESSIONS ACCROSS ALL PAGES
app.use(function(req,res,next){
    res.locals.session = req.session;
    res.locals.user= req.user;
    next();

});
// ENABELING STRIPE PAYMENT PROCESSING
// (async () => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 1099,
//     currency: 'usd',
//     // Verify your integration in this guide by including this parameter
//     metadata: {integration_check: 'accept_a_payment'},
//   });
// })();



//SESSION PROTECTION BY IMPLEMENTING A TOKEN
//app.use(csrfProtection);


///////////////////
//PASSPORT CONFIG//
///////////////////
app.use(require("express-session")({ secret:"It's a secret", resave: false, saveUninitialized: false}));
app.use (passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// //Mongoose Schema
// var orderSchema = new mongoose.Schema({
//     itemName: String,
//     image: String,
//     body:String,
//     created: 
//         {type: Date, default: Date.now()}
// });

// var menuSchema = new mongoose.Schema({

//     tableNumber= Number
    

// });

// var Order = mongoose.model("Order", orderSchema);




// RESTful Routes
app.get("/", function(req,res){
    
    var data;
    var successMsg= req.flash("success");
  
    
    res.render("index", {currentUser:req.user, session: req.session, successMsg:successMsg, noMessages: !successMsg, message:req.flash("lol"), data:data});
   



});



    
app.post("/", function(req,res){
    const spawn = require('child_process').spawn;
    var chat;
    // async function main() {
       
        // var child = require('child_process').exec('python main.py', 
            
        //  function(err, stdout, stderr) { 
        //     // Node.js will invoke this callback when process terminates.
        //     console.log(stdout); 
        //     child.stdout.on('data', function(data) {
        //         console.log(data.toString()); 
        //     });
        // });  
      
    //     const childProcess = spawn('./main.py', req.body.msg,
    //       {stdio: [process.stdin, process.stdout, process.stderr]}); // (A)
      
    //     await onExit(childProcess); // (B)
    //     process.stdout.on('data',function(data) { 
    //         // // console.log(data.toString());
    //         chat=data;
    //     // console.log('### DONE');
        
    //   });
    // }
    //   main();
   
    /////////WORKING/////////////////////////
    var process = spawn('python',["./main.py", 
                                 req.body.msg
                                ])
    // Takes stdout data from script which executed 
    // with arguments and send this data to res object 
    
    process.stdout.on('data',function(data) { 
        // console.log(data.toString());
        
        console.log(data.toString());
        chat=data.toString();

            

   
});
process.on('exit', function () {
    var successMsg= req.flash("success");
res.render("index", {currentUser:req.user, session: req.session, successMsg:successMsg, noMessages: !successMsg, message:req.flash("lol"), data:chat});
  });

});
   
  
  

   
    




// GET MANAGER VIEW

app.get("/manager",isLoggedIn ,function(req,res){
    Category.find({}, function(err, allcategories){
        if (err){
            console.log(err);
        } else
        res.render("manager", {currentUser:req.user, category:allcategories});
   
});

});

//GET KITCHEN VIEW
app.get("/kitchen", function(req,res){
    Order.find().populate('customer').exec(function(err,allOrders){
        if (err){
            console.log(err);
        } 
            var cart;
            allOrders.forEach(function(order){
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
                
            });
            
       
                res.render("kitchen",{
                    currentUser:req.user,
                    orders:allOrders,
        
                
        });
    
        
            
        
    });
       
    

});




//==================
// MENU ROUTES
//==================
app.get("/menu", function(req,res){
    console.log();
    Category.find().populate('categoryProducts').exec(function(err, allcategories){
        Table.find({}, function(err,table){
            if (err){
                console.log(err);
            } else {
                console.log(table);
            res.render("menu", {currentUser:req.user,category:allcategories, table:table});
            }

        });
        
        
           
    });
});
    
    

/////////////////////////////////
//  MENU ROUTE WITH TABLE ORDER
/////////////////////////////////
// TABLE ORDER ROUTE
app.post("/menu", function (req,res){
    Table.create({
            _id:   new mongoose.Types.ObjectId(),
            number:req.body.tableNum,
            
        }, function(err,tableNum){
        if (err){
            console.log(err);
        } else {
        
          //console.log(tableNum);
            
            res.redirect("menu"); 
        
        }
    
});

});








// ADD CATEGORY ROUTE
app.post("/manager/add-cat",upload.single("categoryImage"), function(req,res){
    Category.create({ 
                        _id: new mongoose.Types.ObjectId(),
                        name:req.body.categoryName,
                        categoryImage: req.file.path,
                        
                    }, function(err,newCat){
                                if(err){
                                    console.log (err);
                                } else {
                                    newCat.save();
                                   res.redirect("/manager");
                
                                        }

                    });
});





////////////////////
// Manager Routes//
///////////////////
// ADD PRODUCT ROUTE
app.post("/manager", upload.single("productImage"), function(req,res){
    Category.findOne({name:req.body.catName}, function(err,category){
        if (err){
            console.log(err);
        } else {
            Product.create({ 
                _id: new mongoose.Types.ObjectId(),
                name:req.body.productName,
                productImage: req.file.path,
                productDescription: req.body.productDescription,
                productPrice: req.body.productPrice,
            }, function(err,newProduct){
                        if(err){
                            console.log (err);
                        } else {
                           
                            category.categoryProducts.push(newProduct);
                            category.save();
                        
                            res.redirect("/manager")
        
                                }

            });
        }

    });


    
    
   
});






//=====================
//AUTHORIZATION ROUTES=
//=====================
app.get("/register",csrfProtection, function(req,res){
    
    res.render("register",{currentUser:req.user, csrfToken: req.csrfToken(), messages:null } );
});

//Handle sign up logic
app.post("/register", function(req,res){
    var newUser= new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
    
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            console.log(req.flash("userExistError"));
            res.render("register", {currentUser:req.user, 
                                    csrfToken: req.csrfToken(), 
                                    messages: req.flash("userExistError")});
            
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/profile");
        });

    });

});

//Login Routes
// show login form
app.get("/login",csrfProtection, function(req,res){
    res.render("login",{currentUser:req.user, csrfToken: req.csrfToken()});

});
//Handling login logic
app.post("/login",passport.authenticate("local",
    {successRedirect:"/profile",
    failureRedirect:"/login"

    }) ,function(req,res){
        
});

//logout route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

/////////////////
// PERSONAL PAGE
////////////////



app.get("/profile",isLoggedIn ,function(req,res){
    
    
    
    User.find({}, function(err, allUsers){
        Table.find({},function(err,allTables){
            if(err){
                console.log(err);
            } else {
                console.log(allTables);
            }
       
        if(err){
            console.log(err);
        } else if(req.user.username=="kitchen") { 
            res.redirect("/kitchen");

        } else if(req.user.username=="admin"){
                res.redirect("/manager");
        } else{
            res.render("profile", {users:allUsers, currentUser:req.user, table:allTables});
        }
    });
    });
});





// KITCHEN VIEW
// app.get("/kitchen", isLoggedIn , function(req,res){
//     User.find({},function(err,allUsers){
//         if(err){
//             console.log(err);
//         } else if ({
//             // res.render("kitchen",{users:allUsers, currentUser:req.user});
//             console.log(req.user.username);
//         }

//     });

// });
//////////////////
// CART ROUTE
//////////////////
app.get("/add-to-cart/:id", function(req,res){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart :{});

    Product.findById(productId, function(err, product){
        if (err){
            console.log(err);
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        
        res.redirect("/menu");

        
    });

});
// GET SHOPPING CART
app.get("/shopping-cart", function(req,res){
    if(!req.session.cart){
        req.flash("lol", "Please add items to the shopping cart before viewing");
        return res.redirect("/");
    }
        var cart = new Cart(req.session.cart);
        res.render('shopping-cart', {currentUser:req.user , products:cart.generateArray(), totalPrice : cart.totalPrice});
});

//CHECKOUT ROUTE
app.get("/checkout",isLoggedIn ,function(req,res){
    if(!req.session.cart){
        redirect("/shopping-cart")
    } else{
        var cart = new Cart (req.session.cart);
        var errMsg= req.flash('error');
        Table.find({}, function(err,allTables){
            if (err){
                console.log(err);
            } else {
                
                res.render("checkout", {currentUser:req.user, total:cart.totalPrice, errMsg:errMsg, noErrors: !errMsg, table:allTables});
            }

        });
       

    }
});

//CHECKOUT POST ROUTE
app.post("/checkout", function(req,res){
    
    if(!req.session.cart){
        redirect("/shopping-cart");
    } else {
            var cart = new Cart (req.session.cart);

          
        
        Order.create({
        _id: new mongoose.Types.ObjectId(),
        customer: req.user,
        cart: req.session.cart,
        table:req.body.table,
        cardNumber:req.body.cardNumber,
        cardName:req.body.cardName,
        cardAddress:req.body.cardAddress,
        cardApt:req.body.cardApt,
        cardState:req.body.cardState,
        cardCvc:req.body.cardCvc,
        cardExpMonth:req.body.cardExpMonth,
        cardExpYear:req.body.cardExpYear,
        comments: req.session.comment,
        orderReady: 0
        },function(err,newOrder){
            if(err){
                console.log(err);
                console.log(req.user);
            } else {
            req.flash("lol","Your order has been processed Successfully");
            req.session.cart=null;
            Table.deleteMany({}, function(err,deleted){
                if (err)
                console.log(err);
            });
            res.redirect("/");
           
            }
        });
        
    }
});
 
        // req.flash('success', 'Transaction has processed successfully');
        // req.cart=null;
        // res.redirect("/")
////////////////////
// SHOW ORDER ROUTE/
////////////////////
app.get("/kitchen/:id", function (req,res){
    // find order with that id
    Order.findById(req.params.id).populate("customer").exec(function(err,foundOrder){
        if(err){
            console.log(err);
        } else {
            

            var cart;
            
                cart = new Cart(foundOrder.cart);
                foundOrder.items = cart.generateArray();
                Comment.find({}, function(comment){
                    if (err){
                        console.log(err);
                    } else {
                        console.log(comment);
                        res.render("show", {order:foundOrder, currentUser:req.user, comment:comment})
                    }
               
               });
            
        }

    });

});

//// ADD customer comments
app.post("/comments", function(req,res){
    // Comment.create({
    //     _id: new mongoose.Types.ObjectId(),
    //     customer: req.user,
    //     comment: req.body.comment
        
    // });
    // Comment.save
    // app.use(session({secret: 'ssshhhhh'}));
    req.session.comment= req.body.comment;
    
    // console.log(req.session.comment);
    
    // req.document.cookie="name="+x;

    res.redirect("/checkout");
    
});

// Comment.find({customer:req.user},function(err,foundComment){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(foundComment)
//     }
// });

app.listen(3000, function(){
    console.log("Restaurant Ordering app Server Started...");
   
});