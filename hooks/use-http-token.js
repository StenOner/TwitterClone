import axios from 'axios'
import { useCallback, useState } from 'react'

const useHttpToken = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const sendRequest = useCallback(async (requestConfig, applyData) => {
        setIsLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN)
            if (!token) throw new Error('Token expected.')
            const headers = {
                'Content-Type': requestConfig.headers?.contentType ?? 'application/json',
                'Authorization': `Bearer ${token}`,
            }
            let response = null
            switch (requestConfig.method?.toUpperCase()) {
                case 'POST':
                    response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${requestConfig.url}`, requestConfig.body, { headers })
                    break
                case 'PUT':
                    response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}${requestConfig.url}`, requestConfig.body, { headers })
                    break
                case 'DELETE':
                    response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}${requestConfig.url}`, { headers })
                    break
                default:
                    response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${requestConfig.url}`, { headers })
                    break
            }
            if (applyData) applyData(response)
            return response
        } catch (er) {
            setError(er.response?.data.message || er.message || 'Something went wrong!')
        }
        setIsLoading(false)
    }, [])

    return {
        isLoading,
        error,
        sendRequest
    }
}

export default useHttpToken