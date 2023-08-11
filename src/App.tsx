import { useState, useEffect } from 'react'
import './App.css'
import Product from './Product'
import { CartType, ProductType, UserType } from './types';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import Message from './Message';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_API_KEY
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


function App() {
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState('')
  const [color, setColor] = useState('')
  const [user, setUser] = useState({} as UserType)
  const [cart, setCart] = useState({} as CartType)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
      setColor("#5cb85c");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
      setColor('#FF7276');
    }
  }, []);

  const resetMessage = () => {
    setMessage('')
    setColor('')
  }

  const addToDB = (cart: CartType) => {
    const db = getDatabase();
    set(ref(db, `/carts/${user.id}`), cart)
  };

  const addToCart = (item:ProductType) => {
    const copy = {...cart}
    if (item.id in copy){
      if (copy[item.id].qty){
        copy[item.id].qty += 1
      }
    }
    else{
      copy[item.id] = {...item, qty:0}
      copy[item.id].qty = 1

    }
    setCart(copy)
    // if Logged In, update DB
    if (user.id){
      addToDB(copy)
    }
  };

  const getCart = async (user: UserType) => {
    if (user.id) {
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `/carts/${user.id}`))
      if (snapshot.exists()){
        setCart(snapshot.val())
      }
      else {
        setCart({})
      }
    }
  }
  useEffect(()=>{
    getCart(user)
  }, [user])

  const getProducts = async () => {
    const url = 'https://api.stripe.com/v1/products';
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${STRIPE_KEY}`
      }
    };

    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data)
    console.log(res.status)
    if (res.status === 200){
      setProducts(data.data)
    }
  };

  useEffect(() => {
    getProducts()
  }, [])


  const showProducts = () => {
    return products.map((p: ProductType) => <Product key={p.id} product={p} addToCart={addToCart}/>)
  }
  const showCart = () => {
    return Object.keys(cart).map((key: string, index: number) => <p key={index}>{cart[key].name} x{cart[key].qty}</p>)
  }
  
  const generateInputTags = () => {
    return Object.keys(cart).map((key: string, index: number) => <input key={`input_${index}`} name={cart[key].default_price} value={cart[key].qty} hidden/>)
  };

  const createPopup = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log(user)
    const myUser: UserType = {
      id: user.uid,
      imgUrl: user.photoURL??'https://placeholder.com/20',
      phone: user.phoneNumber,
      email: user.email,
      name: user.displayName
    }
    setUser(myUser)
  };

  return (
    <div>
      {message?<Message message={message} color={color} resetMessage={resetMessage}/>:''}
      <h1>My Shop</h1>
      <main>
        {showProducts()}
      </main>
      {
        user.id?
        <h4>Logged in as: <span><img style={{width:'20px'}} src={user.imgUrl} /></span>{user.name}</h4>
        :
        <button onClick={createPopup} >Sign In With Google</button>
      }
      {showCart()}

      <form method='POST' action={BACKEND_URL + '/api/checkout'}>
        {generateInputTags()}
        <button type='submit'>Check Out</button>
      </form>

    </div>
  )
}

export default App
