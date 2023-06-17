import { memo, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Tweet from './Tweet'
import useHttpToken from '@/hooks/use-http-token'
import TweetFilter from './TweetFilter'

const FILTER_MODES = {
    tweets: 'tweets',
    replies: 'tweets & replies',
    media: 'media',
    likes: 'likes',
}

const Tweets = ({ profile, newTweet, isFilterMode }) => {
    const [tweets, setTweets] = useState([])
    const [filteredTweets, setFilteredTweets] = useState([])
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (!profile?._id) return
        sendRequest({ url: `tweets-info/tweets/profiles-following/${profile._id}` }, ({ data }) => {
            setTweets(data.tweetsInfo)
            setFilteredTweets(data.tweetsInfo)
        })
    }, [profile, sendRequest])

    useEffect(() => {
        if (!newTweet) return
        setTweets((prevState) => [newTweet, ...prevState])
    }, [newTweet, setTweets])

    const filterTweetsHandler = (filterMode) => {
        switch (filterMode) {
            case FILTER_MODES.tweets:
                setFilteredTweets(tweets)
                break
            case FILTER_MODES.replies:
                setFilteredTweets(tweets.filter((tweet) => tweet.comments.length > 0))
                break
            case FILTER_MODES.media:
                setFilteredTweets(tweets.filter((tweet) => tweet.mediaContents.length > 0))
                break
            case FILTER_MODES.likes:
                setFilteredTweets(tweets.filter((tweet) => tweet.likes.length > 0))
                break
            default:
                throw Error('Unkown filter mode.')
        }
    }

    return (
        <>
            {isFilterMode && (
                <TweetFilter filterTweets={(filterMode) => filterTweetsHandler(filterMode)} />
            )}
            <div className='flex flex-col w-full space-y-5'>
                {filteredTweets.map(tweet => (
                    <Tweet key={uuidv4()} profile={profile} tweet={tweet} />
                ))}
            </div>
        </>
    )
}

export default memo(Tweets)
