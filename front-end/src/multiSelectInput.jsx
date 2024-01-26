import React, { useState } from 'react';

const MultiSelectInput = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [newSelectedItem, setNewSelectedItem] = useState('');

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

  const handleOptionClick = (option) => {
    if (selectedItems.includes(option)) {
      setSelectedItems(selectedItems.filter(item => item !== option));
    } else {
      setSelectedItems([...selectedItems, option]);
    }
  };

  const handleButtonClick = () => {
    setShowOptions(!showOptions);
  };

  const handleAddItemClick = () => {
    if (newSelectedItem && !selectedItems.includes(newSelectedItem)) {
      setSelectedItems([...selectedItems, newSelectedItem]);
      setNewSelectedItem('');
    }
  };

  const handleRemoveItemClick = (item) => {
    const updatedSelectedItems = selectedItems.filter(
      (selectedItem) => selectedItem !== item
    );
    setSelectedItems(updatedSelectedItems);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        {showOptions ? 'Hide Options' : 'Show Options'}
      </button>

      {showOptions && (
        <div>
          <select multiple value={selectedItems} onChange={() => {}}>
            {options.map((option) => (
              <option
                key={option}
                value={option}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </option>
            ))}
          </select>

          <div>
            <input
              type="text"
              value={newSelectedItem}
              onChange={(e) => setNewSelectedItem(e.target.value)}
            />
            <button onClick={handleAddItemClick}>Add</button>
          </div>

          <div>
            <h2>Selected Options:</h2>
            <ul>
              {selectedItems.map((item) => (
                <li key={item}>
                  {item}
                  <button onClick={() => handleRemoveItemClick(item)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectInput;