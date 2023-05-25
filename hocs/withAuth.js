import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import useHttpToken from '@/hooks/use-http-token'

const BASE_PROFILE = {
    _id: '',
    fullName: '',
    picture: '',
    banner: '',
    bio: '',
    birthDate: new Date(),
    createdAt: new Date(),
    state: true,
    userID: {},
}

const withAuth = (WrappedComponent) => {
    return (props) => {
        const [myProfile, setMyProfile] = useState(BASE_PROFILE)
        const [token, setMyToken] = useState({})
        const router = useRouter()
        const { error, isLoading, sendRequest } = useHttpToken()
        const isTokenExpired = (token?.exp ?? 0) - Date.now() < 0

        useEffect(() => {
            try {
                const token = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
                const decodedToken = jwtDecode(token)
                sendRequest({ url: `profiles/users/${decodedToken._id}` }, ({ data }) => {
                    setMyProfile(data.profile)
                })
                setMyToken(decodedToken)
            } catch (er) {
                console.log(er.message)
            }
        }, [jwtDecode, sendRequest, setMyProfile])

        useEffect(() => {
            if (!error) return
            router.push('/signin')
        }, [error])

        return (
            <>
                {!error && <WrappedComponent {...props} myProfile={myProfile} />}
            </>
        )
    }
}

export default withAuth
