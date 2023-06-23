import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Link from 'next/link'
import useHttp from '@/hooks/use-http'

const LogIn = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const router = useRouter()
    const { error, isLoading, sendRequest } = useHttp()

    useEffect(() => {
        emailRef.current.value = localStorage.getItem(process.env.NEXT_PUBLIC_LOGIN_EMAIL) || ''
    }, [])

    const onFormSubmit = (e) => {
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value
        sendRequest({ method: 'POST', url: 'auth', body: { email, password } }, ({ data }) => {
            storeEmail()
            storeTokens(data.accessToken, data.refreshToken)
            router.push('/')
        })
    }

    const storeTokens = (accessToken, refreshToken) => {
        localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN, accessToken)
        localStorage.setItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN, refreshToken)
    }

    const storeEmail = () => {
        localStorage.setItem(process.env.NEXT_PUBLIC_LOGIN_EMAIL, emailRef.current.value)
    }

    return (
        <form className='flex flex-col w-3/4 mx-auto justify-center space-y-2 md:w-2/4 xl:w-1/4' onSubmit={onFormSubmit}>
            <LazyLoadImage src='/images/tweeter.svg' alt='Tweeter logo' />
            <div className='form__group self-center'>
                <label htmlFor='email' className='hidden'>Email</label>
                <input ref={emailRef} type='email' className='form__field' placeholder='Email' autoComplete='off' required />
            </div>
            <div className='form__group self-center'>
                <label htmlFor='password' className='hidden'>Email</label>
                <input ref={passwordRef} type='password' className='form__field' placeholder='Password' autoComplete='off' required />
            </div>
            <div className='form__group self-center pt-2'>
                <input type='submit' className='w-full px-2 py-2 bg-blue-400 text-white text-xl font-semibold rounded-full hover:cursor-pointer hover:bg-blue-500 transition-all duration-200 disabled:bg-blue-200 disabled:cursor-not-allowed' disabled={isLoading} value='Log in' />
            </div>
            <div className='form__group self-center pt-2'>
                <span>
                    Don't have an account?
                    <Link href='/signin' className='text-blue-400 hover:underline hover:text-blue-500 lg:pl-1'>
                        Sign in
                    </Link>
                </span>
            </div>
        </form>
    )
}

export default LogIn
