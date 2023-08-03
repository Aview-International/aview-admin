/* 
* @prop chosenValue: The value of the field the input will update
* @prop onChange: Callback when input is triggered
* @prop name: Name of the input
* @prop value: Value of the input
*
* @author Victor Ogunjobi
*/

const RadioInput = ({ value, onChange, name, isSelected }) => {
 return (
   <label
     className={`flex cursor-pointer items-center rounded-full text-xl text-white`}
   >
     <span
       className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full ${ isSelected ?  'gradient-1'  : 'bg-white'}`}
     >
       <span
         className={`inline-block h-4 w-4 rounded-full border-2 border-black ${ isSelected ?  'gradient-1'  : 'bg-black'}`}
       ></span>
     </span>
     <input
       type="radio" 
       
       name={name}
    //    value={value}
       className="hidden"
       onChange={(e) => onChange( value )}
     />
     {value}
   </label>
 );
};

export default RadioInput;