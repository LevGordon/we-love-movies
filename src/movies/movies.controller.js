const movieService = require("./movies.service")
const movies = require("")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const allMovies = await movieService.list()
    const airingMovies = await movieService.listAiringMovies()

    if(req.query.is_showing) {
        res.json({data: airingMovies})
    } else {
        res.json({data: allMovies})
    }
    
}

function movieExists(req, res, next) {
   movieService.read(req.params.movieId)
   .then((movie) => {
   if (movie) {
    res.locals.movie = movie
    return next()
   }
   next({status: 404, message: `Movie cannot be found.`})
 }).catch(next) 
}

function read(req, res) {
    const {movie: data} = res.locals;
    res.json({data})
}


module.exports = {

    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
}