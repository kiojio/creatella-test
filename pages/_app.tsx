import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <main>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
