//? How to generate JWT(JSON WEB TOKEN)
//? Steps:

/**
 * *01 : Install Jwt with (npm install jsonwebtoken).
 * 
 * *02 : require jwt with (const jwt = requite('jsonwebtoken')).
 * 
 * *03 : generate secret with this command
 *       *node
 *       *requite('crypto').randomBytes(64).toString('hex').
 * 
 * *04 : jwt.sign(payload, secret, {expiredIn})
 *       !Do not use the sameSite: none on the third parameter of the object.
 * 
 *       *payload takes the data,
 *       *secret takes a hex code,
 *       *expiredIn object takes a time where the token will expire.
 * 
 * *05 : then send it to the client side.
 * 
 * ? Then you can store it in the client side 3 ways.
 * 
 * *01 : Memory(variable, state)
 * 
 * *02 : LocalStorage,
 * 
 * ?03 : Cookies. Http only.
 * 
 * * 01: set cookies with http only. If localhost then secure: false or true.
 * 
 * * 02: cors setting: 
 *       * app.use(cors({
 *       * origin: ['http://localhost:5173'],
 *       * credentials: true
 *       * }));
 * 
 * * 03 : Require cookie parser "const cookieParser = require('cookie-parser');"
 * 
 * * 04 : Also use the middleware "app.use(cookieParser())"
 * 
 * * 05 : Set in the client side with axios.
 * 
 * ? To send the value of the token in server side, give or add {withCredential : true}
 * 
 * ? within the api call.
 * * 01. To get the value of the token on the same api.
 * * in the server side just use this (req.cookies.tokenName); 
 */


/**
 * ? Verify the token
 * * First need to make an middleware.
 * 
 * ? How to make middle ware?
 * * step: 01 const middlewareName = async (req, res, next);
 * 
 *       * 02 get the tokes by using "req.cookies.tokenName" inside the func.
 *       * 03 and last call the next().
 *       ?NB: Use in in the CRUD method after the pathName.
 *       ?Why call next() : when the middleware work is done the next() call
 *       ? will redirect to the next function of the CRUD method.
  */