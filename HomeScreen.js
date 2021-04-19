import React, { useState, useEffect, useContext } from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { CartContext } from '../context/CartContext';
import ProductListItem from '../components/ProductListItem'
import SearchProductsForm from '../components/SearchProductsForm'
import CategoryBubbles from '../components/CategoryBubbles'
import AddressForm from '../components/AddressForm'
import Header from '../components/Header';
import AuthHeader from '../components/AuthHeader';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

function HomeScreen() {
    const classes = useStyles();

    const [products, setProducts] = useState([])
    const {numCartItems, setNumCartItems} = useContext(CartContext)

    const location = useLocation();
    // console.log(location.search)
    const params = new URLSearchParams(location.search);
    // get the q param
    var searchTerm = params.get('search');
    if (searchTerm == null) {
        searchTerm = ''
    }
    console.log(searchTerm)

    const [authNav, setAuthNav] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        axios.get('/api/users/check_if_user_is_logged_in/').then(function(res) {
            if (res.data.loggedIn) {
                setAuthNav(true)
                async function getNumCartItems() {
                    const { data } = await axios.get(`/api/orders/get_num_cart_items`)
                    setNumCartItems(data.quantity)
                    console.log(data)
                }
                getNumCartItems() 
                // setIsLoading(false)
            } else {
                // setIsLoading(false)
                if (localStorage.getItem('cartItems')) {
                    setNumCartItems(JSON.parse(localStorage.getItem('cartItems')).length)
                }
                
            }   
        }); 
   
    }, [])

    // useEffect(() => {
    //     console.log(`authnav is ${authNav}`)
    //     if (authNav) {
    //         async function getNumCartItems() {
    //             const { data } = await axios.get(`/api/orders/get_num_cart_items`)
    //             setNumCartItems(data.quantity)
    //             console.log(data)
    //         }
    //         getNumCartItems() 
    //     }
    //     else {
    //         setNumCartItems(JSON.parse(localStorage.getItem('cartItems')).length)
    //     }
  
    // }, [])

    // useEffect(() => {

    //     async function fetchProducts() {
    //         const { data } = await axios.get('/api/products/')
    //         setProducts(data)
    //     }

    //     fetchProducts()
        
    // }, [])

    useEffect( () => {
        axios.get(`/api/products/`, {
            params: {
                search: searchTerm,
            }
        })
        .then(res => {
            if (res.data.message) {
                setProductErrorMessage(res.data.message)
            }
            setProducts(res.data)
            setIsLoading(false)
        })
    }, [searchTerm]);

    const [productErrorMessage, setProductErrorMessage] = useState('')

    function ShowProducts() {
        if (productErrorMessage.length > 0) {
            return (
                <div>
                    {productErrorMessage}
                </div>
            )
        } else if (products.length == 0) {
            return (
                <div>
                    No products available at the moment.
                </div>
            )
        } else {
            return (
                <div>
                    <Grid container spacing={3} style={{marginTop: '1.5rem'}}>
                        {products.map(product => (
                            <Grid item xs={6} sm={4} md={3} lg={2} >
                                <ProductListItem key={product._id} product={product} loggedIn={authNav}/>
                        </Grid>
                        ))}
                    </Grid>
                </div>
            )
        }
    }




    const history = useHistory()
    const [emailAddress, setEmailAddress] = useState('test31@gmail.com')

    const [deliveryAddress, setDeliveryAddress] = useState(localStorage.getItem('delAdd') || '')

    function ShowDeliveryAddress() {
        if (deliveryAddress == '') {
            return <Link to='/add_address' style={{color: '#00e1ff'}}>Add delivery address</Link>
        } else {
            return <div><span style={{fontWeight: 'bold'}}>Deliver to:</span> {deliveryAddress} &nbsp;&nbsp;&nbsp;&nbsp;<div><Link to='/add_address' style={{color: '#00e1ff'}}>Change address</Link></div></div>
        }
    }

    // pink secondary color #ff4081

    function sendEmail() {
        axios.post(`/api/users/send_forgot_password_email/`, {
			emailAddress: emailAddress
		})
		  .then(res => {
			  console.log(res.data)
		  });
    }

    function handleLogout() {
        axios.post(`/api/users/customlogout/`)
		  .then(res => {
			  console.log(res.data)
		  });
    }



    return (
        <div>
            <div >
                {isLoading ? null : authNav ? <AuthHeader /> : <Header /> }
            </div>
            {isLoading ? null :
            <div style={{width: '100%', textAlign: 'center', paddingTop: '5rem'}}>
                {/* <div style={{margin: '0 auto', position: 'relative', width: '100%', height: 'auto', maxWidth: '650px'}}>
                    <SearchProductsForm />
                </div> */}
                <ShowDeliveryAddress />
                <div style={{margin: '1rem 0rem'}}>
                    <CategoryBubbles />
                </div>
                <ShowProducts />
                {/* <Grid container spacing={3} style={{marginTop: '1.5rem'}}>
                    
                            {products.map(product => (
                                <Grid item xs={6} sm={4} md={3} lg={2} >
                                    <ProductListItem key={product._id} product={product}/>
                            </Grid>
                            ))}
                    
                </Grid> */}
            </div>}
        </div>
    )
}

export default HomeScreen
