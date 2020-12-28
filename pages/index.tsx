import { useState, useEffect, useRef } from 'react';
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
  const [loadingSort, setLoadingSort] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');
  const [chosen, setChosen] = useState('');
  const listSort = ['price', 'size'];
  const maxPage = Math.ceil(500 / 10);
  const loader = useRef(null);
  const adsValue = Math.floor(Math.random()*1000);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
      setIsLoading(true);
    }
  }

  useEffect(() => {
    if(isLoading){
      setPage((page) => page + 1)
    }
  }, [isLoading])

  useEffect(() => {
    if(page > 1) {
      refresh();
    }
  }, [page])

  const refresh = async () =>{
    let oldData = dataProduct;
    let fetchApi = await fetchData(page, sort);
    let newData = fetchApi;
    let combine = [...products, ...newData.dataProduct];
    if(page % 2 == 0){
      combine = [...combine, {ads: `http://localhost:3000/ads/?r=${adsValue}`}]
    }
    setProducts(combine);
    setIsLoading(false);
    console.log('check', {oldData, newData, combine, page})
  }

  const formatCurrency = (value: number) =>
    "$" + value.toFixed(2).replace(/,/g, " ").replace(".", ",");

  const formatDate = (value: string) => {
    let data = new Date(value)
    return monthNames[data.getMonth()]+' '+data.getDay()+', '+data.getFullYear()
  }
    

  const chosenSort = async(event) => {
    setLoadingSort(true);
    let value = event.target.value;
    let mySort = '';
    mySort = `&_sort=`+value;
    let newData = await fetchData(1, mySort);
    let dataProduct = [...newData.dataProduct];
    setProducts(dataProduct);
    setSort(mySort);
    setChosen(value);
    setLoadingSort(false);
    console.log("data sort", {mySort, dataProduct});
  }

  const gotoTop = () => {
    window.scrollTo(0,0);
  }
  
  const styleSort = {
    flex:1,
    padding: 10, 
    margin:10, 
    borderRadius: 10,
    backgroundColor: 'white'
  }

  return (
    <Layout title="Product List">
      <div>
        <div className="d-flex">
          <div>
            {loadingSort ?
              <h3>Loading ...</h3>
              :
              '' 
            }
          </div>
          <div className="ml-auto">
            <select 
              value={chosen}
              onChange={chosenSort}
              style={styleSort}
            >
              <option value="">Choose sort</option>
              {
                listSort.map((data, key) => (
                  <option value={data} selected={data == chosen}>{data}</option>
                ))
              }            
            </select>
          </div>
        </div>
        <div className="row">
          {!error && dataProduct && (
              products.map((data, key) => {
                if(data.hasOwnProperty('ads')) {
                  return <div key={key} className="card col-6 p-1">
                    <img src={data.ads}/>
                  </div>
                } else {
                  return <div key={key} className="card col-6 p-1">
                    <p className="align-self-center text-center justify-content-center" style={{fontSize: data.size}}>{data.face}</p>
                    <div className="card-body" style={{marginTop: 'auto'}}>
                      <h5 className="card-title">{formatCurrency(data.price)}</h5>
                      <p className="card-text">{formatDate(data.date)}</p>
                    </div>
                  </div>
                }
              })
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

