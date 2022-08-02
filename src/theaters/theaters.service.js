const knex = require("../db/connection")


function list() {
    return knex("theaters")
    .select("*")
}

function getMoviesByTheater(){
    
}

module.exports = {
list,
}