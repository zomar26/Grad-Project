import React, { useState } from 'react'; 
import { FiEye, FiEyeOff } from 'react-icons/fi'; 
import './Input.css';

const Input = ({ type, placeholder, Icon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="input-wrapper">
      {Icon && <Icon className="input-icon-left" />}
      
      <input 
        type={inputType} 
        placeholder={placeholder} 
        className={`custom-input ${Icon ? 'has-left-icon' : ''}`} 
        {...props}
      />

      {type === 'password' && (
        <div className="input-icon-right" onClick={togglePasswordVisibility}>
          {showPassword ? <FiEye /> : <FiEyeOff />} 
        </div>
      )}
    </div>
  );
};

export default Input;