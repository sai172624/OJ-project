import axios from "axios";
const dotenv=require('dotenv');
const API_URI = 'http://localhost:{PORT}';

export const registerUser= async(formdata)=>{
   try{
    const response=await axios.post(`${API_URI}/auth/register`,formdata);
    return response.data;
   }
   catch(err){
    console.log('Error while registering user',err);
   }    
}
