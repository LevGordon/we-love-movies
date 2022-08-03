const theaterSevice = require("./theaters.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const theaters = await theaterSevice.list()
  const theatersMovies = []
  for (let i = 0; i < theaters.length; i++) {
    const theater = theaters[i]
    const {theater_id} = theater
    const movie = await theaterSevice.getMoviesByTheater(theater_id)
    const returnMovie = {... theater, movies: movie}
    theatersMovies.push(returnMovie)

  }
  res.json({ data: theatersMovies})

}


module.exports = {
    list,

  };