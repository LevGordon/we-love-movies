const movieService = require("./movies.service")
// const movies = require("")
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

async function listTheatersHostingMovie(req, res, next) {
    const data = await movieService.listTheatersHostingMovie()
    res.json({ data })
}

async function listReviewsAndCritics(req, res, next) {
    
    const criticData = await movieService.listReviewsAndCritics(req.params.movieId)
    // console.log(data)
    const data = criticData.map((row) => {
        return {review_id: (row.review_id), content: (row.content), score: (row.score), created_at: (row.created_at),
            updated_at: (row.updated_at), critic_id: (row.critic_id), movie_id: (row.movie_id),
            critic: {critic_id: (row.critic_id), preferred_name: (row.preferred_name),
            surname: (row.surname), organization_name: (row.organization_name), created_at: (row.created_at),
            updated_at: (row.updated_at)
        }}
    })
    res.json({data})
}


module.exports = {

    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
    listTheatersHostingMovie,
    listReviewsAndCritics,
}