import React,{ useState } from 'react'
import RadioInput from '../../FormComponents/RadioInput'

const RadioContent = ({ title, data, option1, option2, setData, name }) => {

  const [selectedOption, setSelectedOption] = useState();
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setData(name,!data)
  };

  return (
    <div className='flex flex-col'>
      <h4>{title}</h4>
      <RadioInput value={option1}   onChange={handleOptionChange} name={name} isSelected={selectedOption === option1}/>
      <RadioInput value={option2}   onChange={handleOptionChange} name={name}  isSelected={selectedOption === option2}/>
    </div>
  )
}

export default RadioContent
