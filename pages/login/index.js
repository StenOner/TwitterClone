import axios from 'axios'
import { useRef } from 'react'
import { useRouter } from 'next/router'

const LogIn = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const router = useRouter()

    const onFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const email = emailRef.current.value
            const password = passwordRef.current.value
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth`, { email, password })
            loginUser(data.accessToken, data.refreshToken)
        } catch ({ response }) {
            alert(response.data.message);
        }
    }
    const loginUser = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        router.push('/')
    }

    return (
        <form className='flex flex-col w-1/4 mx-auto justify-center space-y-2' onSubmit={onFormSubmit}>
            <img src='/images/tweeter.svg' alt='Tweeter logo' />
            <div className='form__group self-center'>
                <label htmlFor='email' className='hidden'>Email</label>
                <input ref={emailRef} type='email' className='form__field' placeholder='Email' autoComplete='off' required />
            </div>
            <div className='form__group self-center'>
                <label htmlFor='password' className='hidden'>Email</label>
                <input ref={passwordRef} type='password' className='form__field' placeholder='Password' autoComplete='off' required />
            </div>
            <div className='form__group self-center pt-2'>
                <input type='submit' className='w-full px-2 py-2 bg-blue-400 text-white text-xl font-semibold rounded-full hover:cursor-pointer hover:bg-blue-500 transition-all duration-200' value='Log in' />
            </div>
        </form>
    )
}

export default LogIn
