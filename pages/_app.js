import { useRouter } from 'next/router'
import Head from 'next/head'
import Header from '../components/Header'

import 'tailwindcss/tailwind.css'
import '../styles.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Tweeter</title>
        <link rel="icon" href="/images/tweeter-small.svg" />
      </Head>
      {router.route != '/login' && router.route != '/signin' && <Header />}
      <main className='relative flex min-h-screen bg-home bg-center bg-no-repeat bg-fixed inset-0'>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
