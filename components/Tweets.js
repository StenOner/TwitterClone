import { memo, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Tweet from './Tweet'
import useHttpToken from '@/hooks/use-http-token'

const FILTER_MODES = {
    tweets: 'tweets',
    replies: 'tweets & replies',
    media: 'media',
    likes: 'likes',
}

const Tweets = ({ profile, newTweet, filterMode }) => {
    const [tweets, setTweets] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profile?._id) return
        sendRequest({ url: `tweets-info/tweets/profiles-following/${profile._id}` }, ({ data }) => {
            console.log(data.tweetsInfo);
        })
    }, [sendRequest])

    useEffect(() => {
        if (!profile?._id) return
        sendRequest({ url: `tweets/profiles-following/${profile._id}` }, ({ data }) => {
            setTweets(data.tweets)
        })
    }, [profile, sendRequest, setTweets])

    useEffect(() => {
        if (!newTweet) return
        setTweets((prevState) => [newTweet, ...prevState])
    }, [newTweet, setTweets])

    useEffect(() => {
        if (!filterMode) return
        switch (filterMode) {
            case FILTER_MODES.tweets:
                setFilteredTweets(tweets)
                break
            case FILTER_MODES.replies:
                setFilteredTweets(tweets.filter((tweet) => tweet.comments))
                break
            case FILTER_MODES.media:
                setFilteredTweets(tweets.filter((tweet) => tweet.mediaContents))
                break
            case FILTER_MODES.likes:
                setFilteredTweets(tweets.filter((tweet) => tweet.likes))
                break
            default:
                throw Error('Unkown filter mode.')
        }
    }, [filterMode])

    return (
        <div className='flex flex-col w-full space-y-6'>
            {tweets.map(tweet => (
                <Tweet key={uuidv4()} profile={profile} tweet={tweet} />
            ))}
        </div>
    )
}

export default memo(Tweets)
