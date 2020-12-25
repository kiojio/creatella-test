import React, { ReactNode } from 'react'
import Head from 'next/head'

type Props = {
    children?: ReactNode
    title?: string
}

const adsValue = Math.floor(Math.random()*1000); 

const Layout = ({ children, title = 'This is the default title' }: Props) => (
    <div>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <header className="container">
            <h1>Products Grid</h1>

            <p>Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our selection of ascii faces in an exciting range of sizes and prices.</p>

            <p>But first, a word from our sponsors:</p><img className="ad" src={`http://localhost:3000/ads/?r=${adsValue}`}/>
        </header>
        <section className="main container">
            {children}
        </section>
    </div>
)

export default Layout