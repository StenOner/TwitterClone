import { useEffect, useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import useHttpToken from '@/hooks/use-http-token'

const CommentLikeButton = ({ profile, tweetComment }) => {
    const [likes, setLikes] = useState(tweetComment.likes || [])
    const [isLiked, setIsLiked] = useState(false)
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (likes.some((_like) => _like.profileID._id === profile._id)) {
            setIsLiked(true)
            return
        }
        setIsLiked(false)
    }, [likes, profile, setIsLiked])

    const likeCommentHandler = () => {
        const tweetCommentLikeBody = {
            tweetCommentID: tweetComment._id,
            profileID: profile._id,
            state: true,
        }
        sendRequest({ method: 'POST', url: 'tweets-comments-likes', body: tweetCommentLikeBody }, ({ data }) => {
            setLikes((prevState) => [data.tweetCommentLike, ...prevState])
        })
    }

    const unlikeCommentHandler = () => {
        const tweetCommentLikeID = likes.find((_like) => _like.profileID._id === profile._id)._id
        sendRequest({ method: 'DELETE', url: `tweets-comments-likes/${tweetCommentLikeID}` }, ({ data }) => {
            setLikes((prevState) => prevState.filter((_prev) => _prev._id !== data.tweetCommentLike._id))
        })
    }

    return (
        <div className='flex w-full space-x-4 text-gray-400'>
            <div className={`${isLiked ? 'text-[#EB5757] ' : ''}flex flex-row space-x-1 py-1 cursor-pointer items-center rounded-md hover:bg-gray-100`} onClick={isLiked ? unlikeCommentHandler : likeCommentHandler}>
                <HeartIcon className='h-4' />
                <span className='hidden sm:flex'>Like{isLiked && 'd'}</span>
            </div>
            <div className='flex flex-row items-center'>
                <span>
                    {likes.length} Like{likes.length !== 1 && 's'}
                </span>
            </div>
        </div>
    )
}

export default CommentLikeButton