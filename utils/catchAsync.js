// module.exports = fn => {



//     return (req, res, next) => {
//         fn(req, res, next).catch(err => {

//             next(err)
//         })
//         // fn(req, res, next).catch(next) // this is similar to the upper code ,
//         //next() is called automatically with the parameter recived by the catch block


//     }
// }

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};