import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Trend from './Trend'
import useHttpToken from '@/hooks/use-http-token'

const Trends = ({ profile }) => {
    const [trends, setTrends] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        sendRequest({ url: 'tweets-trending' }, ({ data }) => {
            const sortedTrends = data.tweetTrends.sort((a, b) => b.tweets.length - a.tweets.length)
            setTrends(sortedTrends)
        })
    }, [sendRequest, setTrends])

    return (
        <div className='flex flex-col w-full bg-white rounded-xl px-5 py-3'>
            <span className='font-semibold'>Trends</span>
            <hr className='my-2' />
            <div className='flex flex-col w-full space-y-4'>
                {trends.map((trend) => (
                    <Trend key={uuidv4()} trend={trend} />
                ))}
            </div>
        </div>
    )
}

export default Trends
