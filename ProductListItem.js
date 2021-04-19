import React, { useContext } from 'react'
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, makeStyles, Fab } from '@material-ui/core'
import { AddShoppingCart } from '@material-ui/icons'
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CartContext } from '../context/CartContext';

// function ProductListItem({ product }) {
//     return (
//         <div>

//         </div>
//     )
// }

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '100%',
        // maxHeight: '250px'
      },
      media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
        // paddingTop: '30%', // 16:9
        img: {
            display: 'block',
            maxWidth:'230px',
            maxHeight:'95px',
            width: 'auto',
            height: 'auto'
          }
      },

      cardActions: {
        display: 'flex',
        justifyContent: 'flex-end',
      },
      cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
      },
}))


function ProductListItem ({ product, loggedIn }) {

    const classes = useStyles()

    const {numCartItems, setNumCartItems} = useContext(CartContext)

    const data = {
        public_id: product.public_id,
        action: 'add'
    }

    function handleAddToCart() {
        if (loggedIn) {
            var config = {
                method: 'post',
                url: `/api/orders/add_to_cart/`,
                data : data
            };
            axios(config).then(res => {
                console.log(res.data)
                setNumCartItems(res.data.quantity)
            })
        }
        else {
            var cartItems = localStorage.getItem('cartItems')
            if (cartItems != null) {
                // console.log(cartItems)
                var parsedCartItems = JSON.parse(cartItems)
                parsedCartItems.push(product.public_id)
                localStorage.setItem("cartItems", JSON.stringify(parsedCartItems))
                setNumCartItems(parsedCartItems.length)
            }
            else {
                var newCartItem = [product.public_id]
                localStorage.setItem("cartItems", JSON.stringify(newCartItem))
                setNumCartItems(1)
            }
        }

    }

    return (
        <div>
            {/* <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <Card className={classes.root}>
                <CardMedia className={classes.media} image={product.imageUrl} title={product.name} />
                <CardContent>
                    <div className={classes.CardContent}>
                        <Typography variant="subtitle2" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography variant="body2">
                            ${product.price}
                        </Typography>
                    </div>
                </CardContent>
                <CardActions disableSpacing className={classes.cardActions}>
                    <Fab  size="small" color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </CardActions>
            </Card>
            </Link> */}

            <div class="ui raised card" style={{borderRadius: '20px', width: '200px', height: '220px'}}>
                <div class="content">
                    <Link to={`/product/${product.public_id}`} style={{ textDecoration: 'none' }}>
                        <div style={{height: '90px'}}>
                            <img src={product.imageUrl} style={{display: 'block', maxWidth: '80px', maxHeight: '80px', 
                                width: 'auto', height: 'auto', margin: 'auto'}}>
                            </img>
                        </div>
                        <div style={{height: '50px'}}>
                            <div class="center aligned" style={{fontSize: '1rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', color: '#000'}}>{product.name}</div>
                            <div class="meta">
                                <div class="center aligned description" style={{color: 'black'}}>{product.price}</div>
                            </div>
                        </div>
                    </Link>
                    {/* <div class="right floated author">
                        <i class="big plus circle icon" style={{color: 'blue', cursor: 'pointer'}} onClick={handleAddToCart}></i>
                    </div> */}
                    <div style={{marginTop: '1.2rem', cursor: 'pointer'}}>
                        <div className="" onClick={handleAddToCart} style={{width: '80%', padding: '0.5rem 0rem 0.5rem 0rem', backgroundColor: '#00e1ff', color: 'white', margin: 'auto', borderRadius: '5px', textAlign: 'center'}}>Add</div>
                    </div>
                </div>


                
            </div>
                

        </div>
        // <div className="" style={{borderRadius: '20px', maxWidth: '24rem', overflow: 'hidden', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem', marginBotton: '2rem'}}>
        //     <Link to='/product/:id'>
        //         <div style={{maxHeight: '200px', overflow: 'hidden'}}>
        //             <img className="" style={{width: '100%'}}  src={product.imageUrl} alt="Newsletter promo image"></img>
        //         </div>
        //         <div className="" style={{paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '1rem', paddingBottom: '1rem'}}>
        //             <p className="" style={{paddingBottom: '0.5rem'}}>{product.name}</p>
        //             <div className="" style={{marginBottom: '0.5rem'}}>{product.price}</div>
        //         </div>
        //     </Link>
        // </div>
    )
}



export default ProductListItem


{/* <div className="" style={{borderRadius: '20px', maxWidth: '24rem', overflow: 'hidden', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem', marginBotton: '2rem'}}>
<Link to='/product/:id'>
    <div style={{maxHeight: '200px', overflow: 'hidden'}}>
        <img className="" style={{width: '100%'}}  src="https://i.imgur.com/OQtNm9k.jpg" alt="Newsletter promo image"></img>
    </div>
    <div className="" style={{paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '1rem', paddingBottom: '1rem'}}>
<p className="" style={{paddingBottom: '0.5rem'}}>{product.name}</p>
<div className="" style={{marginBottom: '0.5rem'}}>{product.price}</div>
    </div>
</Link>
</div> */}
