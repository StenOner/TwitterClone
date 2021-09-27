import { useEffect, useState } from 'react'
import { BookmarkIcon, ChatAltIcon, HeartIcon, RefreshIcon } from '@heroicons/react/outline'
import dateFormat from 'dateformat'
import useHttpToken from '../hooks/use-http-token'
import NewComment from './NewComment'

const PROFILE_IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const Tweet = ({ profile, tweet: tweetData }) => {
    const [tweet, setTweet] = useState(tweetData)
    const [comments, setComments] = useState([])
    const [retweets, setRetweets] = useState([])
    const [likes, setLikes] = useState([])
    const [saved, setSaved] = useState(false)
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        sendRequest({ url: `tweet-comments-by-tweet/${tweet._id}` }, ({ data }) => {
            setComments(data.tweetComments)
        })
    }, [sendRequest, setComments])

    useEffect(() => {
        sendRequest({ url: `tweet-retweets-by-tweet/${tweet._id}` }, ({ data }) => {
            setRetweets(data.tweetRetweets)
        })
    }, [sendRequest, setRetweets])

    useEffect(() => {
        sendRequest({ url: `tweet-likes-by-tweet/${tweet._id}` }, ({ data }) => {
            setLikes(data.tweetLikes)
        })
    }, [sendRequest, setLikes])

    return (
        <div className='flex flex-col bg-white rounded-xl p-6 space-y-4'>
            <div className='flex space-x-4'>
                <img src={profile?.picture ? `${PROFILE_IMAGE_BASE_URL}${profile.picture}` : '/images/default_profile_normal.png'} alt='Profile image' className='rounded-lg max-h-[44px]' width={44} />
                <div className='flex flex-col justify-between'>
                    <span className='font-semibold capitalize'>
                        {profile.fullName}
                    </span>
                    <span className='text-gray-400 text-xs'>
                        {dateFormat(new Date(tweet.createdAt), 'dd mmmm "at" HH:MM')}
                    </span>
                </div>
            </div>
            <div className='flex w-full'>
                <span>
                    {tweet.content}
                </span>
            </div>
            <div className='flex w-full'>
                image
            </div>
            <div className='flex space-x-2 text-xs text-gray-400 justify-end'>
                <span>
                    {comments.length} Comments
                </span>
                <span>
                    {retweets.length} Retweets
                </span>
                <span>
                    {0} Saved
                </span>
            </div>
            <div className='flex justify-evenly'>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <ChatAltIcon className='h-5' />
                    <span>Comments</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <RefreshIcon className='h-5' />
                    <span>Retweets</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <HeartIcon className='h-5' />
                    <span>Likes</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <BookmarkIcon className='h-5' />
                    <span>Saved</span>
                </div>
            </div>
            <div className='flex w-full'>
                <NewComment profile={profile} tweet={tweet} />
            </div>
        </div>
    )
}

export default Tweet
