import React from 'react';
import './FilterForm.css'

const FilterForm = ({ genres, selectedGenre, selectedRating, onFilterChange, onApplyFilters }) => {
  return (
    <div className="filter-form">
      <label className='label-name' htmlFor="genre">Filter by Genre:</label>
      <select
        className='option'
        id="genre"
        value={selectedGenre}
        onChange={(e) => onFilterChange('genre', e.target.value)}
      >
        <option  value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
      <label className='label-name' htmlFor="minRating">Minimum Rating:</label>
      <input
        type="number"
        id="minRating"
        value={selectedRating.min}
        onChange={(e) => onFilterChange('rating', { ...selectedRating, min: e.target.value })}
      />
      <label className='label-name' htmlFor="maxRating">Maximum Rating:</label>
      <input
        type="number"
        id="maxRating"
        value={selectedRating.max}
        onChange={(e) => onFilterChange('rating', { ...selectedRating, max: e.target.value })}
      />
      <button className='button' onClick={onApplyFilters}>Apply</button>
    </div>
  );
};

export default FilterForm;
