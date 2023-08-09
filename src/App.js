
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import MovieCard from './components/movieCard/MovieCard';
import Pagination from './components/pagination/Pagination';
import FilterForm from './components/genreFilter/FilterForm';

class App extends Component {
  state = {
    query: '',
    movies: [],
    searchResults: [],
    currentPage: 1,
    moviesPerPage: 5,
    genres: [],
    selectedGenre: '',
    selectedRating: { min: '', max: '' },
  };

  componentDidMount() {
    this.fetchGenres();
    this.fetchMovies();
  }

  fetchGenres = async () => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/genre/movie/list',
        {
          params: {
            api_key: '62f44457e4f21102e1dc2b5d19198698',
            language: 'en-US',
          },
        }
      );

      this.setState({
        genres: response.data.genres,
      });
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  fetchMovies = async () => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        {
          params: {
            api_key: '62f44457e4f21102e1dc2b5d19198698',
            language: 'en-US',
            sort_by: 'popularity.desc',
            include_adult: false,
            include_video: false,
            page: this.state.currentPage,
          },
        }
      );

      this.setState({
        movies: response.data.results,
        page: 1,
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  handleSearch = async () => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: {
            api_key: '62f44457e4f21102e1dc2b5d19198698',
            language: 'en-US',
            query: this.state.query,
            page: this.state.currentPage,
          },
        }
      );

      this.setState({
        searchResults: response.data.results,
      });
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  handleChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleFilterChange = (type, value) => {
    if (type === 'genre') {
      this.setState({ selectedGenre: value, currentPage: 1 }, this.fetchMovies);
    } else if (type === 'rating') {
      this.setState({ selectedRating: value, currentPage: 1 });
    }
  };

  handleApplyFilters = async () => {
    const { selectedGenre, selectedRating } = this.state;

    // Fetch data with applied filters
    const response = await axios.get(
      'https://api.themoviedb.org/3/discover/movie',
      {
        params: {
          api_key: '62f44457e4f21102e1dc2b5d19198698',
          language: 'en-US',
          sort_by: 'popularity.desc',
          with_genres: selectedGenre,
          'vote_average.gte': selectedRating.min || undefined,
          'vote_average.lte': selectedRating.max || undefined,
        },
      }
    );

    // Update movies state with filtered data
    this.setState({
      movies: response.data.results,
      currentPage: 1,
    });
  };
  
  handleNextPage = () => {
    const { currentPage, selectedGenre } = this.state;
    const moviesPerPage = this.state.moviesPerPage; 
    const movieList = selectedGenre ? this.state.movies : this.state.searchResults;
    const totalPages = Math.ceil(movieList.length / moviesPerPage);

    if (currentPage < totalPages) {
      this.setState({ currentPage: currentPage + 1 });
    }
  };

  handlePrevPage = () => {
    const { currentPage } = this.state;

    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  render() {
    const { query, movies, searchResults, currentPage, moviesPerPage, genres, selectedGenre, selectedRating,  } = this.state;

    

    const movieList = searchResults.length > 0 ? searchResults : movies;

    const filteredByGenre = selectedGenre
      ? movieList.filter((movie) =>
          movie.genre_ids.includes(Number(selectedGenre))
        )
      : movieList;

      const filteredByRating = selectedRating.min || selectedRating.max
      ? filteredByGenre.filter(
          (movie) =>
            (selectedRating.min === '' || movie.vote_average >= Number(selectedRating.min)) &&
            (selectedRating.max === '' || movie.vote_average <= Number(selectedRating.max))
        )
      : filteredByGenre;  

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = filteredByRating.slice(indexOfFirstMovie, indexOfLastMovie);

    const totalPages = Math.ceil(filteredByRating.length / moviesPerPage);
  

    return (
      <div className="App">
        
        <div className='nav-container'>
          <img className='logo' src='https://images-platform.99static.com//7U79SQng-sHEyKSrKRGodV-hz90=/1038x11:2029x1002/fit-in/590x590/99designs-contests-attachments/79/79212/attachment_79212533' alt='Movie-name' />
            <input
              id='search'
              className='input-search'
              type="search"
              value={query}
              onChange={this.handleChange}
              placeholder="Search for a movie..."
              autofocus required
            />
            <button type='submit' onClick={this.handleSearch}>Search</button>

            <FilterForm
              genres={genres}
              selectedGenre={selectedGenre}
              selectedRating={selectedRating}
              onFilterChange={this.handleFilterChange}
              onApplyFilters={this.handleApplyFilters}
            />
        </div>

        

        <div className="card-container">
          {currentMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={this.handleNextPage}
          onPrevPage={this.handlePrevPage}
        />
      </div>
    );
  }
}

export default App;
