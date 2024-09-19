import React from 'react';
import { User, LockKeyhole, Mail } from "lucide-react";

interface InputFieldProps {
  label: string;
  type: string;
  variant?: 'filled' | 'underlined' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  id?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // เพิ่มการรับ prop นี้
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  variant,
  size,
  icon,
  name,
  id,
  onChange, // รับ prop นี้
}) => {

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-full h-7 text-sm';
      case 'md':
        return 'w-full h-9 text-md';
      case 'lg':
        return 'w-full h-11 text-xl';
      default:
        return 'w-full h-9 text-md'; // default size
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'floating':
        return 'block py-2.5 px-0 bg-transparent appearance-none rounded-sm border-b-2 border-primary/20 focus:outline-none focus:ring-0 focus:border-primary/60 peer';
      case 'filled':
        return 'block py-1 px-0 bg-primary/10 border-2 border-primary/10 focus:outline-none focus:border-primary/50 rounded-sm';
      case 'underlined':
        return 'block py-2.5 px-0 bg-transparent appearance-none rounded-sm border-b-2 border-primary/20 focus:outline-none focus:ring-0 focus:border-primary/60 peer';
      default:
        return 'block py-1 px-0 bg-primary/10 border-2 border-primary/10 focus:outline-none focus:border-primary/50 rounded-sm';
    }
  };
  const getLabelClass = () => {
    switch (variant) {
      case 'floating':
        return 'peer-focus:font-semibold absolute duration-300 left-10 transform -translate-y-6 scale-80 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-7';
      case 'filled':
        return 'font-semibold absolute bottom-5 text-primary -z-10 origin-[0]';
      case 'underlined':
        return 'peer-focus:font-semibold absolute duration-300 left-0 text-primary transform -translate-y-6 scale-80 top-1 -z-10 origin-[0]';
      default:
        return 'font-semibold absolute bottom-5 text-primary -z-10 origin-[0]'; // ค่าพื้นฐาน
    }
  };

  const getIcon = () => {
    switch (icon) {
      case "user":
        return <User size={35} strokeWidth={2} className='text-primary/90 bg-primary/20 rounded-l-lg p-1' />;
      case "password":
        return <LockKeyhole size={35} strokeWidth={2} className='text-primary/90 bg-primary/20 rounded-l-lg p-1' />;
      case "mail":
        return <Mail size={35} strokeWidth={2} className='text-primary/90 bg-primary/20 rounded-l-lg p-1' />;
      default:
        return <User size={35} strokeWidth={2} className='text-primary/90 bg-primary/20 rounded-l-lg p-1' />;
    }
  };


  return (
    <div className="relative z-0 w-full pt-1 mt-6 group">
      <div className="flex items-center">
        <div className="absolute ">
          {getIcon()}
        </div>
        <input
          type={type}
          name={name}
          id={id}
          className={`input pl-10 ${getSizeClass()} ${getVariantClass()}`}
          placeholder=''
          required
          onChange={onChange}
        />
        <label htmlFor={id} className={`input ${getLabelClass()} ${getSizeClass()}`}>
          {label}
        </label>
      </div>
    </div>
  );
};

export default InputField;
