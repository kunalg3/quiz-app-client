import React from 'react'
import { useState } from 'react';
import styles from './LogIn.module.css'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';

function LogIn() {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
        });
    const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const {data}=await axios.post('/auth/login',formData)
            if(data.error){
                toast.error(data.error)
            }
            else{
                // Cookies.set('token', data.token, { expires: 1, secure: true, sameSite: 'Strict' });
                console.log('token=',data.token)
                toast.success("Welcome! Login Success")
                localStorage.setItem('JWT',data.token);
                navigate('/dashboard')
            }
        } catch (error) {
            toast.error("Login Failed! Internal sever error")
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit} className={styles.form_field}>
            
            <div className={styles.input_field}>
                <p className={styles.input_type}>Email</p>
                <input 
                type='email' 
                name='email' 
                value={formData.email} 
                onChange={(e)=>handleInputChange(e)}></input>
            </div>
            <div className={styles.input_field}>
                <p className={styles.input_type}>Password</p>
                <input 
                type='password' 
                name='password' 
                value={formData.password} 
                onChange={(e)=>handleInputChange(e)}></input>
            </div>
            
            <button className={styles.submit_btn} type='submit'>Log In</button>
        </form>
    </div>
  )
}

export default LogIn