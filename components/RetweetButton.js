import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import useHttpToken from '@/hooks/use-http-token'

const RetweetButton = ({ profile, tweet, retweets, addRetweet, deleteRetweet }) => {
    const [isRetweeted, setIsRetweeted] = useState(false)
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (retweets.some((_retweet) => _retweet.profileID._id === profile._id)) {
            setIsRetweeted(true)
            return
        }
        setIsRetweeted(false)
    }, [retweets, profile, setIsRetweeted])

    const retweetHandler = () => {
        const retweetBody = {
            tweetID: tweet.tweetID,
            profileID: profile._id,
            state: true,
        }
        sendRequest({ method: 'POST', url: 'tweets-retweets', body: retweetBody }, ({ data }) => {
            addRetweet(data.tweetRetweet)
        })
    }

    const unRetweetHandler = () => {
        const retweetID = retweets.find((_retweet) => _retweet.profileID._id === profile._id)._id
        sendRequest({ method: 'DELETE', url: `tweets-retweets/${retweetID}` }, ({ data }) => {
            deleteRetweet(data.tweetRetweet._id)
        })
    }

    return (
        <div className={`${isRetweeted ? 'text-[#27AE60] ' : ''}flex flex-row space-x-2 py-2 px-6 cursor-pointer rounded-md hover:bg-gray-100`} onClick={isRetweeted ? unRetweetHandler : retweetHandler}>
            <ArrowPathIcon className='h-5' />
            <span className='hidden lg:flex'>Retweet{isRetweeted && 'ed'}</span>
        </div>
    )
}

export default RetweetButton