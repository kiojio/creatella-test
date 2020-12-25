import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const fetchData = async (page, sort) => await axios.get(`http://localhost:3000/api/products?_page=${page}&limit=10${sort}`)
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
  const [sort, setSort] = useState('');
  const [chosen, setChosen] = useState('');
  const listSort = ['price', 'size'];

  const refresh = async () =>{
    setIsLoading(true);
    let oldData = dataProduct;
    let fetchApi = await fetchData(page+1, sort);
    let newData = fetchApi;
    let combine = [...products, ...newData.dataProduct];
    console.log('check', {oldData, newData, combine})
    setProducts(combine);
    setPage(page+1);
    setIsLoading(false);
  }

  const chosenSort = async(event) => {
    setIsLoading(true);
    let value = event.target.value;
    let mySort = '';
    mySort = `&_sort=`+value;
    let newData = await fetchData(1, mySort);
    let dataProduct = [...newData.dataProduct];
    setProducts(dataProduct);
    setSort(mySort);
    setChosen(value);
    setIsLoading(false);
    console.log("data sort", {mySort, dataProduct});
  }

  return (
    <Layout title="Product List">
      <div>
        <h1>Product</h1>
        <button
          onClick={refresh}
        >Test</button>
        {isLoading ? <h1>Loading...</h1> : ''}
        <div>
          <select 
            value={chosen}
            onChange={chosenSort}
          >
            <option value="">Choose sort</option>
            {
              listSort.map((data, key) => (
                <option value={data} selected={data == chosen}>{data}</option>
              ))
            }            
          </select>
        </div>
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
  const data = await fetchData(1, '');

  return {
    props: data,
  };
}

export default Home;

