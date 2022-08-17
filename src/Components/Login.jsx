import axios from 'axios';
import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

export default function Login(props) {
    let navigate = useNavigate();
    const [isLoding, setIsLoding] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        email: '',
        password:''
    });
    function getUserData(e)
    {
        let myUser = {...user};
        myUser[e.target.name] = e.target.value;
        setUser(myUser);
        // console.log(user);
    };
    async function submitForm(e)
    {
        e.preventDefault();
        setIsLoding(true);
        let {data} = await axios.post('https://route-egypt-api.herokuapp.com/signin',user);
        // console.log(data);

        if(data.message === 'success')
        {
            navigate('/home');
            setIsLoding(false);
            localStorage.setItem('userToken',data.token);
            props.saveData();
        }else{
            setError(data.message);
            setIsLoding(false)
        }
        // console.log(data);


    }
  return (
    <>
    <div className="container my-5 py-5">
        <div className="col-md-5 m-auto text-center">
            <form onSubmit={submitForm}>
                <div className="form-group">
                    <input onChange={getUserData} placeholder="Enter email" type="email" name="email" className="form-control" />
                </div>
                <div className="form-group my-2">
                    <input onChange={getUserData} placeholder="Enter you password" type="password" name="password" className=" form-control" />
                </div>
                <button type="submit" className='btn btn-info w-100'>
                    {isLoding?<i className='fas fa-spinner fa-spin'></i>:'SignIn'}
                </button>
                {error?<div className="alert alert-danger mt-2">{error}</div>:''}   
            </form>
        </div>
    </div>
</>
  )
}
