import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const fetchData = async (page) => await axios.get(`http://localhost:3000/api/products?_page=${page}&_limit=10`)
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
  const [products, setProducts] = useState(dataProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const refresh = async () =>{
    setIsLoading(true);
    let oldData = dataProduct;
    let fetchApi = await fetchData(page+1);
    let newData = fetchApi;
    let combine = [...products, ...newData.dataProduct];
    console.log('check', {oldData, newData, combine})
    setProducts(combine);
    setPage(page+1);
    setIsLoading(false);
  }

  return (
    <Layout title="Product List">
      <div>
        <h1>Product</h1>
        <button
          onClick={refresh}
        >Test</button>
        <div className="row">
          {!error && dataProduct && (
              products.map((data, key) => (
                <div className="card col-6 p-1" style={{width: 288}}>
                  <p className="align-self-center text-center justify-content-center" style={{fontSize: data.size}}>{data.face}</p>
                  <div className="card-body align-self-end" style={{marginTop: 'auto'}}>
                    <h5 className="card-title">{data.price}</h5>
                    <p className="card-text">{data.date}</p>
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await fetchData(1);

  return {
    props: data,
  };
}

export default Home;

