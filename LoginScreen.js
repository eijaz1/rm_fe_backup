import React, { useState, useEffect, useContext } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import Header from '../components/Header';

const useStyles = makeStyles((theme) => ({
	paper: {
	  marginTop: theme.spacing(8),
	  display: 'flex',
	  flexDirection: 'column',
	  alignItems: 'center',
	},
	avatar: {
	  margin: theme.spacing(1),
	  backgroundColor: theme.palette.secondary.main,
	},
	form: {
	  width: '100%', // Fix IE 11 issue.
	  marginTop: theme.spacing(1),
	},
	submit: {
	  margin: theme.spacing(3, 0, 2),
	},
  }));

function LoginScreen() {
    const classes = useStyles();
    const history = useHistory()

    const {numCartItems, setNumCartItems} = useContext(CartContext)

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    })
    const [validLoginInfo, setValidLoginInfo] = useState(true)

    const [loggedInEmail, setLoggedInEmail] = useState('')

    function InvalidLoginInfoMessage() {
        if (validLoginInfo == false) {
            return (
                <div className="ui red message" style={{textAlign: 'left'}}>
                    <b>Email address or password are invalid</b>
                </div>
            );
        } else {
            return null
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function checkPasswordRequirements(password)  { 
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        return re.test(String(password))
    }

    const data = {
        email: loginInfo.email, 
        password: loginInfo.password
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(data)
        // if (!validateEmail(loginInfo.email) || !checkPasswordRequirements(loginInfo.password)) {
        //     setValidLoginInfo(false)
        //     console.log('invalid login details frontend')
        // }
        if (!validateEmail(loginInfo.email)) {
            setValidLoginInfo(false)
            console.log('invalid login details frontend')
        }
        else {
            // const { data } = await axios.get('/api/users/customlogin/', {
            //     // params: {
            //     //     email: loginInfo.email,
            //     //     password: loginInfo.password
            //     // }
            // }

            // )
            // setLoggedInEmail(data.email)
            console.log(data)
            // axios.get('http://localhost:8000/api/users/customlogin/', {
            //     params: {
            //         email: loginInfo.email,
            //         password: loginInfo.password
            //     }
            // })
            var config = {
                method: 'post',
                url: '/api/users/customlogin/',
                data: data
            };
            axios(config)       
            .then(res => {
                console.log(res.data);
                console.log(`address is ${res.data.address}`)
                console.log(`unitnum is ${res.data.unitNum}`)
                localStorage.setItem('delAdd', res.data.address)
                localStorage.setItem('un', res.data.unitNum)
                console.log('login completed');
                if (localStorage.getItem('cartItems')) {
                    handleAddToCart()
                }
                
                // localStorage.removeItem('cartItems')
                history.push(`/`)        
            })
            .catch(function (error) {
            // Handle error
            console.log('login error');
            // setServerError(true)
        });
        }
    }

    function handleAddToCart() {
        const data = {
            productsList: JSON.parse(localStorage.getItem('cartItems')),
        }
        var config = {
            method: 'post',
            url: `/api/orders/add_ls_products_to_cart/`,
            data : data
        };
        axios(config).then(res => {
            console.log(res.data)
            setNumCartItems(res.data.quantity)
            localStorage.removeItem('cartItems')
        })

    }



    function onEmailInputChange(e) {
        setLoginInfo({...loginInfo, email: e.target.value})
    }

    function onPasswordInputChange(e) {
        setLoginInfo({...loginInfo, password: e.target.value})
    }

    return (
        <div>
            <Header />
            {/* <Navigation /> */}
            <div class="ui middle aligned center aligned grid" style={{marginTop: '10%'}}>
                {/* <CheckLogin /> */}
                <div class="column" style={{width: '85%', maxWidth: '40rem', margin: 'auto'}}>
                    <InvalidLoginInfoMessage />
                    <h2 class="ui image header">
                        <div class="content">
                            Login to your account
                        </div>
                    </h2>
                    <form class="ui large form" onSubmit={handleSubmit}>
                        <div class="ui stacked secondary  segment">
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="user icon"></i>
                                    <input type="text" value={loginInfo.email} onChange={onEmailInputChange} placeholder="E-mail address" />
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui left icon input">
                                    <i class="lock icon"></i>
                                    <input type="password" value={loginInfo.password} onChange={onPasswordInputChange} placeholder="Password" />
                                </div>
                            </div>
                            <button class="ui fluid large submit button" type="submit" style={{background: '#00e1ff', color: '#fff'}}>Login</button>
                        </div>

                        <div class="ui error message"></div>

                    </form>

                    <div class="ui message">
                        New to us? <Link to="/register" style={{color: '#00e1ff'}}>Sign Up</Link>
                    </div>
                    <div class="ui message">
                        <Link to="/password_reset_request" style={{color: '#00e1ff'}}>Forgot password</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginScreen
