import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import useHttpToken from '../hooks/use-http-token'

const WithAuth = (WrappedComponent) => {
    return (props) => {
        const [myProfile, setMyProfile] = useState({})
        const router = useRouter()
        const { error, isLoading, sendRequest } = useHttpToken()

        useEffect(() => {
            const token = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
            const { _id } = jwtDecode(token)
            sendRequest({ url: `profiles/users/${_id}` }, ({ data }) => {
                setMyProfile(data.profile)
            })
        }, [setMyProfile])

        useEffect(() => {
            if (!error) return;
            router.push('/signin')
        }, [error])

        return (
            <>
                {!error && <WrappedComponent {...props} myProfile={myProfile} />}
            </>
        )
    }
}

export default WithAuth
