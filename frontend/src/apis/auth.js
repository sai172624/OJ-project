import axios from "axios";
   const API_URI = import.meta.env.VITE_API_BASE_URL;
export const registerUser = async (formdata) => {
    try {
        const response = await axios.post(`${API_URI}/auth/register`, formdata);
        return response.data;
    } catch (err) {
        console.log('Error while registering user', err);
        throw err;  
    }    
};

export const loginUser = async (formdata) => {
    try {
       
        const response = await axios.post(`${API_URI}/auth/login`, formdata);
        
        return response.data;
    } catch (err) {
        console.log('Error while logging in user', err);
        throw err;  
    }    
};

