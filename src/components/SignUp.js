import React from 'react'
import { useState } from 'react'
import styles from './SignUp.module.css'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password:'',
        });
       
    const navigate=useNavigate();
    const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const {data}= await axios.post('/auth/register',formData)
            if(data.error){
                toast.error(data.error)
            }
            else{
                toast.success("Account registered successfully")
                navigate('/')
            }
        } catch (error) {
            console.log(error)
            toast.error("Registration failed! Server Error")
        }

    }
    
  return (
    <div>
        <form onSubmit={handleSubmit} className={styles.form_field} method='post'>
            <div className={styles.input_field}>
                <p className={styles.input_type}>Name</p>
                <input 
                type='text' 
                name='name' 
                value={formData.name} 
                onChange={(e)=>handleInputChange(e)}></input>
            </div>
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
            <div className={styles.input_field}>
                <p className={styles.input_type}>Confirm Password</p>
                <input 
                type='password' 
                name='confirm_password' 
                value={formData.confirm_password}
                onChange={(e)=>handleInputChange(e)}></input>
            </div>
            <button className={styles.submit_btn} type='submit'>Sign-Up</button>
        </form>
    </div>
  )
}

export default SignUp