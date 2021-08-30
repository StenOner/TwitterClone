import { useRouter } from 'next/router'
import { useRef } from 'react'
import axios from 'axios'

const SignIn = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const userNameRef = useRef()
    const router = useRouter()

    const onFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const email = emailRef.current.value
            const password = passwordRef.current.value
            const userName = userNameRef.current.value
            const state = true

            const { data: userData } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}user/new`, { email, password, userName, state })
            const { data: loginData } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth`, { email, password })
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}profile/new`, { userID: userData.user._id, fullName: 'My Profile', bio: 'My Bio', birthDate: new Date(), state: true },
                {
                    headers: {
                        'Authorization': `Bearer ${loginData.accessToken}`
                    }
                })
            loginUser(loginData.accessToken, loginData.refreshToken)
        } catch ({ response }) {
            alert(response.data.message)
        }

    }
    const loginUser = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        router.push('/')
    }

    return (
        <form className='flex flex-col w-1/4 mx-auto justify-center space-y-2' onSubmit={onFormSubmit}>
            <img src='/images/tweeter.svg' alt='Tweeter logo' width='100%' />
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
        </form>
    )
}

export default SignIn
