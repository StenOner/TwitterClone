import axios from 'axios'
import { useCallback, useState } from 'react'

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const sendRequest = useCallback(async (requestConfig, applyData) => {
        setIsLoading(true)
        setError(null)
        try {
            const headers = {
                'Content-Type': requestConfig.headers?.contentType ?? 'application/json',
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
        } catch (error) {
            setError(error.response?.data.message || error.message || 'Something went wrong!')
        }
        setIsLoading(false)
    }, [])

    return {
        isLoading,
        error,
        sendRequest
    }
}

export default useHttp