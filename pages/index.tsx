import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import styled, { keyframes } from "styled-components";

const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 15px }
  100% { margin-bottom: 0 }
`;
const DotWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;
const Dot = styled.div`
  background-color: black;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 5px;
  /* Animation */
  animation: ${BounceAnimation} 0.5s linear infinite;
  animation-delay: ${props => props.delay};
`;

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
  const maxPage = Math.ceil(500 / 10);
  const loader = useRef(null);

  useEffect(() => {
    let options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    // initialize IntersectionObserver
    // and attaching to loading div
      const observer = new IntersectionObserver(handleObserver, options);
      if (loader.current) {
        observer.observe(loader.current)
      }

  }, []);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {   
        setPage((page) => page + 1)
    }
  }

  useEffect(() => {
    if(page > 1) {
      refresh();
    }
  }, [page])

  const refresh = async () =>{
    setIsLoading(true);
    let oldData = dataProduct;
    let fetchApi = await fetchData(page, sort);
    let newData = fetchApi;
    let combine = [...products, ...newData.dataProduct];
    setProducts(combine);
    setIsLoading(false);
    console.log('check', {oldData, newData, combine, page})
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

  const gotoTop = () => {
    window.scrollTo(0,0);
  }

  return (
    <Layout title="Product List">
      <div>
        <h1>Product</h1>
        <button
          onClick={refresh}
        >Test</button>
        {isLoading ?
          <DotWrapper>
            <Dot delay="0s" />
            <Dot delay=".1s" />
            <Dot delay=".2s" />
          </DotWrapper> 
          : ''
        }
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
        <div className="row w-full flex flex-wrap items-center justify-center">
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
        {page !== maxPage ? (
          <h2 className="align-Items-center" ref={loader}>Load More</h2>
        ) : (
          <div className="row">
            <h2 className="align-self-center">~ end of catalogue ~</h2>
            <button onClick={gotoTop}>Goto Top</button>
          </div>
        )}
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

