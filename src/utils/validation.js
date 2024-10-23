// src/utils/validation.js
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return passwordRegex.test(password);
  };
  
  export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  export const validateName = (name) => {
    return name.trim().length >= 2;
  };
  
  export const validateProjectTitle = (title) => {
    return title.trim().length >= 3;
  };
  
  export const validateImageSize = (size) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    return size <= MAX_SIZE;
  };
  
  export const validateImageFormat = (type) => {
    const validFormats = ['image/jpeg', 'image/png', 'image/heic'];
    return validFormats.includes(type.toLowerCase());
  };
  
  export const getValidationErrors = (data) => {
    const errors = {};
  
    if (data.email && !validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  
    if (data.password && !validatePassword(data.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase and number';
    }
  
    if (data.name && !validateName(data.name)) {
      errors.name = 'Name must be at least 2 characters';
    }
  
    if (data.phone && !validatePhone(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  
    return errors;
  };