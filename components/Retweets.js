import { useEffect, useState } from 'react'
import { RefreshIcon } from '@heroicons/react/outline'
import { v4 as uuidv4 } from 'uuid'
import useHttpToken from '../hooks/use-http-token'
import Retweet from './Retweet'

const Retweets = ({ profile }) => {
    const [retweets, setRetweets] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profile?._id) return
        sendRequest({ url: `tweets-retweets/profiles/${profile._id}` }, ({ data }) => {
            setRetweets(data.tweetRetweets)
        })
    }, [profile, sendRequest, setRetweets])

    return (
        <div className='flex flex-col w-full space-y-6'>
            <div className='flex space-x-2 text-sm text-gray-400'>
                <RefreshIcon className='h-5' />
                <span>{profile.fullName} Retweeted</span>
            </div>
            {retweets?.map(retweet => (
                <Retweet key={uuidv4()} profile={profile} retweet={retweet} />
            ))}
        </div>
    )
}

export default Retweets
