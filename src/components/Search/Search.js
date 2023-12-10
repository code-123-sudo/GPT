import React, { useState , useEffect , useRef } from 'react';
import { connect } from 'react-redux';
import "./Search.css"

const Search = () => {
  const [searchValue,setSearchValue] = useState("")

  const handleChange = (e) => {
    setSearchValue(e.target.value)
  }

  return (
    <div className="searchContainer">
      <input type="text" placeholder="search" onChange={() => {handleChange(event)}} value={searchValue} className="searchInput" />
    </div>
  );
};

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)