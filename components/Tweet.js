import { useEffect, useState } from 'react'
import { BookmarkIcon, ChatAltIcon, HeartIcon, RefreshIcon } from '@heroicons/react/outline'
import { v4 as uuidv4 } from 'uuid'
import dateFormat from 'dateformat'
import useHttpToken from '../hooks/use-http-token'
import NewComment from './NewComment'
import WithAuth from '../hocs/WithAuth'
import Comments from './Comments'

const IMAGE_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}download/`

const Tweet = ({ profile, tweet }) => {
    const [newComment, setNewComment] = useState(null)
    const [comments, setComments] = useState([])
    const [retweets, setRetweets] = useState([])
    const [likes, setLikes] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const [mediacontents, setMediacontents] = useState([])
    const [saved, setSaved] = useState(false)
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        sendRequest({ url: `tweets-comments/tweets/${tweet._id}` }, ({ data }) => {
            setComments(data.tweetComments)
        })
    }, [sendRequest, setComments])

    useEffect(() => {
        sendRequest({ url: `tweets-retweets/tweets/${tweet._id}` }, ({ data }) => {
            setRetweets(data.tweetRetweets)
        })
    }, [sendRequest, setRetweets])

    useEffect(() => {
        sendRequest({ url: `tweets-likes/tweets/${tweet._id}` }, ({ data }) => {
            setLikes(data.tweetLikes)
        })
    }, [sendRequest, setLikes])

    useEffect(() => {
        sendRequest({ url: `tweets-bookmarks/tweets/${tweet._id}` }, ({ data }) => {
            setBookmarks(data.tweetBookmarks)
        })
    }, [sendRequest, setBookmarks])

    useEffect(() => {
        sendRequest({ url: `tweets-mediacontents/tweets/${tweet._id}` }, ({ data }) => {
            setMediacontents(data.tweetMediacontents)
        })
    }, [sendRequest, setMediacontents])

    const addComment = (comment) => {
        setNewComment(comment)
        setComments((prevState) => {
            return [comment, ...prevState]
        })
    }

    return (
        <div className='flex flex-col bg-white rounded-xl p-6 space-y-4'>
            <div className='flex space-x-4'>
                <img src={profile?.picture ? `${IMAGE_BASE_URL}${profile.picture}` : '/images/default_profile_normal.png'} alt='Profile image' className='rounded-lg max-h-[44px]' width={44} />
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
            {mediacontents.length > 0 && (
                <div className='flex w-full space-x-2'>
                    {mediacontents.map((mediacontent) => (
                        <img key={uuidv4()} src={`${IMAGE_BASE_URL}${mediacontent.content}`} />
                    ))}
                </div>)}
            <div className='flex space-x-2 text-xs text-gray-400 justify-end'>
                <span>
                    {comments.length} Comments
                </span>
                <span>
                    {retweets.length} Retweets
                </span>
                <span>
                    {bookmarks.length} Saved
                </span>
            </div>
            <div className='flex justify-evenly'>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <ChatAltIcon className='h-5' />
                    <span className='hidden sm:flex'>Comments</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <RefreshIcon className='h-5' />
                    <span className='hidden sm:flex'>Retweets</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <HeartIcon className='h-5' />
                    <span className='hidden sm:flex'>Likes</span>
                </div>
                <div className='flex flex-row space-x-2 py-2 px-6 cursor-pointer hover:bg-gray-100'>
                    <BookmarkIcon className='h-5' />
                    <span className='hidden sm:flex'>Saved</span>
                </div>
            </div>
            <div className='flex w-full'>
                <NewComment profile={profile} tweet={tweet} addComment={addComment} />
            </div>
            <div className='flex flex-col w-full'>
                <Comments profile={profile} tweet={tweet} newComment={newComment} />
            </div>
        </div>
    )
}

export default WithAuth(Tweet)
