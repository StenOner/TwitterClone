import { useRouter } from 'next/router'
import { useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Link from 'next/link'
import useHttp from '@/hooks/use-http'
import useHttpToken from '@/hooks/use-http-token'

const DEFAULT_USER = {
    userID: '',
    fullName: 'My Profile',
    bio: 'My Bio',
    birthDate: new Date(),
    state: true,
}

const SignIn = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const userNameRef = useRef()
    const router = useRouter()
    const { isLoading: isLoadingHttp, error: errorHttp, sendRequest: sendRequestHttp } = useHttp()
    const { isLoading: isLoadingHttpToken, error: errorHttpToken, sendRequest: sendRequestHttpToken } = useHttpToken()

    const onFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const email = emailRef.current.value
            const password = passwordRef.current.value
            const userName = userNameRef.current.value
            const state = true
            const { data: userData } = await sendRequestHttp({ method: 'POST', url: 'users', body: { email, password, userName, state } })
            const { data: loginData } = await sendRequestHttp({ method: 'POST', url: 'auth', body: { email, password } })
            storeTokens(loginData.accessToken, loginData.refreshToken)
            const { data: profileData } = await sendRequestHttpToken({ method: 'POST', url: 'profiles', body: { ...DEFAULT_USER, userID: userData.user._id, fullName: userName } })
            router.push(`/profile/${profileData.profile._id}/edit`)
        } catch (er) {
            console.log(errorHttp || errorHttpToken || er.message);
        }
    }
    const storeTokens = (accessToken, refreshToken) => {
        localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN, accessToken)
        localStorage.setItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN, refreshToken)
    }

    return (
        <form className='flex flex-col w-3/4 mx-auto justify-center space-y-2 md:w-2/4 xl:w-1/4' onSubmit={onFormSubmit}>
            <LazyLoadImage src='/images/tweeter.svg' alt='Tweeter logo' width='100%' />
            <div className='form__group self-center'>
                <label htmlFor='email' className='hidden'>Email</label>
                <input ref={emailRef} type='email' className='form__field' placeholder='Email' autoComplete='off' required />
            </div>
            <div className='form__group self-center'>
                <label htmlFor='password' className='hidden'>Email</label>
                <input ref={passwordRef} type='password' className='form__field' placeholder='Password' autoComplete='off' required />
            </div>
            <div className='form__group self-center'>
                <label htmlFor='username' className='hidden'>User Name</label>
                <input ref={userNameRef} type='text' className='form__field' placeholder='User Name' autoComplete='off' required />
            </div>
            <div className='form__group self-center pt-2'>
                <input type='submit' className='w-full px-2 py-2 bg-blue-400 text-white text-xl font-semibold rounded-full hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' value='Sign in' />
            </div>
            <div className='form__group self-center pt-2'>
                <span>
                    Already have an account?
                    <Link href='/login' className='text-blue-400 hover:underline hover:text-blue-500 lg:pl-1'>
                        Log in
                    </Link>
                </span>
            </div>
        </form>
    )
}

export default SignIn
