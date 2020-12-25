import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const fetchData = async () => await axios.get('http://localhost:3000/api/products')
  .then(res => ({
    error: false,
    dataProduct: res.data,
  }))
  .catch(() => ({
      error: true,
      dataProduct: null,
    }),
);

const Home = ({dataProduct, error}) => {
  const [products, setProducts] = useState(dataProduct.slice(0, 10));
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(10);

  const refresh = () =>{
    setIsLoading(true);
    let oldData = dataProduct;
    let newData = dataProduct.slice(limit, limit+10);
    let combine = [...products, ...newData];
    console.log("check", {oldData, newData, products, combine});
    setTimeout(() => {
      setProducts(combine);
      setLimit(limit+10);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Layout title="Product List">
      <div>
        <h1>Product</h1>
        <button
          onClick={refresh}
        >Test</button>
        {!error && dataProduct && (
            products.map((data, key) => (
              <div className="card" style={{width: 288}}>
                <p className="align-self-center">{data.face}</p>
                <div className="card-body">
                  <h5 className="card-title">{data.price}</h5>
                  <p className="card-text">{data.date}</p>
                </div>
              </div>
            ))
          )
        }
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await fetchData();

  return {
    props: data,
  };
}

export default Home;

