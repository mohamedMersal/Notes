import axios from 'axios';
import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

export default function Register() {
    let navigate = useNavigate();
    const [isLoding, setIsLoding] = useState(false);
    const [error, setError] = useState('');
    // const [user, setUser] = useState({
    //     'first_name':'',
    //     'last_name':'',
    //     'email':'',
    //     'password':''
    // })
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        age:0,
        email: '',
        password:''
    });
    function getUserData(e)
    {
        let myUser = {...user};
        myUser[e.target.name] = e.target.value;
        setUser(myUser);
        // setUser({...user,[e.target.name]:e.target.value})
        // console.log(user);
    };
    async function submitForm(e)
    {
        e.preventDefault();
        setIsLoding(true);
        let {data} = await axios.post('https://route-egypt-api.herokuapp.com/signup',user);
        if(data.message === 'success')
        {
            navigate('/login');
            setIsLoding(false);

        }else{
            setError(data.message);
            setIsLoding(false)
        }
        console.log(data);


    }
  return (
    <>
    <div className="container my-5 py-5">
        <div className="col-md-5 m-auto text-center">
            <form onSubmit={submitForm}>
                <div className="form-group">
                    <input onChange={getUserData} placeholder="Enter your name" name="first_name" type="text" className=" form-control" />
                </div>
                <div className="form-group my-2 ">
                    <input onChange={getUserData} placeholder="Enter your name" name="last_name" type="text" className="form-control" />
                </div>
                {/* <div className="form-group my-2 ">
                    <input onChange={getUserData} placeholder="Enter your age" name="age" type="numeber" className="form-control" />
                </div> */}
                <div className="form-group">
                    <input onChange={getUserData} placeholder="Enter email" type="email" name="email" className="form-control" />
                </div>
                <div className="form-group my-2">
                    <input onChange={getUserData} placeholder="Enter you password" type="password" name="password" className=" form-control" />
                </div>
                <button type="submit" className='btn btn-info w-100'>
                    {isLoding?<i className='fas fa-spinner fa-spin'></i>:'SignUp'}
                </button>
                {error?<div className="alert alert-danger mt-2">{error}</div>:''}   
            </form>
        </div>
    </div>
</>
  )
}
