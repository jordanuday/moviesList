import React from 'react';
import "./MovieCard.css"

const MovieCard = ({ movie }) => {
  return (
    <div className="card">
      <img className='image'
        src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
        alt={`${movie.title} poster`}
      />
      <div className='contents'>
        <h2 className='heading'>{movie.title}</h2>
        <p className='para1'>Release Date: {movie.release_date}</p>
        <p className='para1'>Rating: {movie.vote_average}</p>
        <p className='description'>{movie.overview}</p>
        
      </div>
    </div>
  );
};

export default MovieCard;
