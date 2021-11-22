import { useState } from 'react'
import { useQuery } from 'react-query'
import Drawer from '@material-ui/core/Drawer'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import Badge from '@material-ui/core/Badge'
import Cart from './Cart/Cart'
import Item from './Item/Item'
import { StyledButton, Wrapper } from './App.styles'

export interface ICartItem {
  id: number
  title: string
  description: string
  image: string
  price: number
  amount: number
}

const getProducts = async (): Promise<ICartItem[]> => await (await fetch('https://fakestoreapi.com/products')).json()


const App = () => {

  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([] as ICartItem[])
  const { data, isLoading, error } = useQuery<ICartItem[]>('products', getProducts)

  const getTotalItems = (items: ICartItem[]) => {
    return items.reduce((index: number, item) => index + item.amount, 0)
  }

  const handleAddToCart = (clickedItem: ICartItem) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if (isItemInCart) {
        return prev.map(
          item => item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        )
      }
      return [...prev, { ...clickedItem, amount: 1 }]
    })
  }

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => 
      prev.reduce((index, item) => {
        if (item.id === id) {
          if (item.amount === 1) return index
          return [...index, { ...item, amount: item.amount - 1 }]
        } else {
          return [...index, item]
        }
      }, [] as ICartItem[]
    ))
  }

  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went wrong ...</div>

  return (
    <Wrapper>
      <Drawer
       anchor="right"
       open={cartOpen}
       onClose={() => setCartOpen(false)}
      >
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  )
}

export default App