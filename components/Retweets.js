import { useEffect, useState } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { v4 as uuidv4 } from 'uuid'
import Retweet from './Retweet'
import useHttpToken from '@/hooks/use-http-token'

const Retweets = ({ myProfile }) => {
    const [retweets, setRetweets] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!myProfile?._id) return
        sendRequest({ url: `tweets-retweets/profiles/${myProfile._id}` }, ({ data }) => {
            setRetweets(data.tweetRetweets)
        })
    }, [myProfile, sendRequest, setRetweets])

    return (
        <div className='flex flex-col w-full space-y-6'>
            <div className='flex space-x-2 text-sm text-gray-400'>
                <ArrowPathIcon className='h-5' />
                <span>{myProfile.fullName} Retweeted</span>
            </div>
            {retweets?.map(retweet => (
                <Retweet key={uuidv4()} myProfile={myProfile} profile={myProfile} retweet={retweet} />
            ))}
        </div>
    )
}

export default Retweets
