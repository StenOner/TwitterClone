import { useRouter } from 'next/router'
import React from 'react'
import Footer from '@/components/Footer'
import Head from 'next/head'
import Header from '@/components/Header'

import 'tailwindcss/tailwind.css'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <React.StrictMode>
        <Head>
          <title>Tweeter</title>
          <link rel="icon" href="/images/tweeter-small.svg" />
        </Head>
        {router.route != '/login' && router.route != '/signin' && <Header />}
        <main className='relative flex flex-col min-h-screen inset-0'>
          <Component {...pageProps} />
        </main>
        <Footer />
      </React.StrictMode>
    </>
  )
}
