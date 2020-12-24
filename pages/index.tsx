import Head from 'next/head';
import { useState } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const [products, setProducts] = useState([]);


  return (
    <Layout title="Product List">
      <div>
        <h1>Product</h1>
      </div>
    </Layout>
  );
}
