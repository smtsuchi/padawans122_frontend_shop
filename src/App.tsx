import { useState, useEffect } from 'react'
import './App.css'
import Product from './Product'
import { CartType, ProductType, UserType } from './types';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref, set, child, get } from 'firebase/database';

const STRIPE_KEY = ''


function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState({} as UserType)
  const [cart, setCart] = useState({} as CartType)

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

    </div>
  )
}

export default App
