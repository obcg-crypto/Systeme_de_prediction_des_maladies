import React, { useEffect, useState }  from 'react'
import './Search.css'

const SearchBar = ({list, setList,  filterField = item => item,  ...props}) => {
    const [value, setValue] = useState("");

    useEffect(() => {
      if (value) {
        setList(filterList())
      }
      else{
        setList(list)
      }
    }, [value])

    const filterList = () => {
        return list.filter(item => filterField(item).toLowerCase().includes(value.toLocaleLowerCase()))
     }  
    
     const handleChange = (e) => {
      setValue(e.target.value) 
     } 
  return (
    <div className='searche'>
      <label htmlFor="text">Rechercher ici : </label>
      <input className='search-bare' type="text" onChange={handleChange} value={value} {...props}/>
    </div>
  )
}

export default SearchBar