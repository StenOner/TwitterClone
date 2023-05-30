import { Suspense, lazy, useCallback, useEffect, useReducer, useState } from 'react'
import Link from 'next/link'
import dateFormat from 'dateformat'
import BookmarkButton from './BookmarkButton'
import Comments from './Comments'
import CommentButton from './CommentButton'
import RetweetButton from './RetweetButton'
import LikeButton from './LikeButton'
import Loading from './Loading'
import NewComment from './NewComment'
import useHttpToken from '@/hooks/use-http-token'
const ImageGallery = lazy(() => import('./ImageGallery'))
const ImageMediaContent = lazy(() => import('./ImageMediaContent'))

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_state':
            return { ...action.payload }
        case 'add_comment':
            return {
                ...state,
                comments: [action.payload, ...state.comments],
            }
        case 'add_retweet':
            return {
                ...state,
                retweets: [action.payload, ...state.retweets],
            }
        case 'delete_retweet':
            return {
                ...state,
                retweets: state.retweets.filter((retweet) => retweet._id !== action.payload),
            }
        case 'add_like':
            return {
                ...state,
                likes: [action.payload, ...state.likes],
            }
        case 'delete_like':
            return {
                ...state,
                likes: state.likes.filter((like) => like._id !== action.payload),
            }
        case 'add_bookmark':
            return {
                ...state,
                bookmarks: [action.payload, ...state.bookmarks],
            }
        case 'delete_bookmark':
            return {
                ...state,
                bookmarks: state.bookmarks.filter((bookmark) => bookmark._id !== action.payload),
            }
        default:
            throw Error('Unkown state.')
    }
}
const TWEET_INFO_BASE = {
    tweetID: null,
    bookmarks: [],
    comments: [],
    likes: [],
    mediaContents: [],
    retweets: [],
}

const Tweet = ({ profile, tweet }) => {
    const [newComment, setNewComment] = useState(null)
    const [tweetInfoState, tweetInfoDispatch] = useReducer(reducer, TWEET_INFO_BASE)
    const [canReply, setCanReply] = useState(false)
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        tweetInfoDispatch({ type: 'set_state', payload: tweet })
    }, [tweet, tweetInfoDispatch])

    useEffect(() => {
        if (!profile?._id) return
        if (tweet.profileID._id === profile._id) return setCanReply(true)
        if (tweet.tweetReplyOptionID.content?.toLowerCase() === 'everyone') return setCanReply(true)
        if (tweet.tweetReplyOptionID.content?.toLowerCase() === 'people you follow') {
            sendRequest({ url: `profiles-followers/${tweet.profileID._id}` }, ({ data }) => {
                const followers = data.profileFollowers
                if (followers.some(follower => follower.followerProfileID._id === profile._id)) setCanReply(true)
            })
        }
    }, [tweet, profile, setCanReply, sendRequest])

    const addCommentHandler = useCallback((comment) => {
        setNewComment(comment)
        tweetInfoDispatch({ type: 'add_comment', payload: comment })
    }, [])

    return (
        <div className='flex flex-col bg-white rounded-xl p-6 space-y-4'>
            <div className='flex space-x-4'>
                <Suspense fallback={<Loading />}>
                    <ImageMediaContent
                        src={tweet.profileID.picture ?? '/images/default_profile_normal.png'}
                        className='rounded-lg max-h-11'
                        alt='Profile image' />
                </Suspense>
                <div className='flex flex-col justify-between'>
                    <Link href={`/profile/${tweet.profileID._id}`} className='font-semibold capitalize'>
                        {tweet.profileID.fullName}
                    </Link>
                    <span className='text-gray-400 text-xs'>
                        {dateFormat(new Date(tweet?.createdAt ?? '1970/01/01'), 'dd mmmm "at" HH:MM')}
                    </span>
                </div>
            </div>
            <div className='flex w-full'>
                <span>
                    {tweet.content}
                </span>
            </div>
            {tweetInfoState.mediaContents.length > 0 && (
                <div className='flex w-full space-x-2'>
                    <Suspense fallback={<Loading />}>
                        <ImageGallery
                            images={tweetInfoState.mediaContents} />
                    </Suspense>
                </div>
            )}
            <div className='flex space-x-2 text-xs text-gray-400 justify-end'>
                <span>
                    {tweetInfoState.comments.length} Comment{tweetInfoState.comments.length !== 1 && 's'}
                </span>
                <span>
                    {tweetInfoState.retweets.length} Retweet{tweetInfoState.retweets.length !== 1 && 's'}
                </span>
                <span>
                    {tweetInfoState.likes.length} Like{tweetInfoState.likes.length !== 1 && 's'}
                </span>
                <span>
                    {tweetInfoState.bookmarks.length} Saved
                </span>
            </div>
            <div className='flex flex-col space-y-2'>
                <hr />
                <div className='flex justify-evenly'>
                    <CommentButton profile={profile} tweet={tweet} comments={tweetInfoState.comments} />
                    <RetweetButton profile={profile} tweet={tweet} retweets={tweetInfoState.retweets}
                        addRetweet={(retweet) => tweetInfoDispatch({ type: 'add_retweet', payload: retweet })}
                        deleteRetweet={(retweetID) => tweetInfoDispatch({ type: 'delete_retweet', payload: retweetID })} />
                    <LikeButton profile={profile} tweet={tweet} likes={tweetInfoState.likes}
                        addLike={(like) => tweetInfoDispatch({ type: 'add_like', payload: like })}
                        deleteLike={(likeID) => tweetInfoDispatch({ type: 'delete_like', payload: likeID })} />
                    <BookmarkButton profile={profile} tweet={tweet} bookmarks={tweetInfoState.bookmarks}
                        addBookmark={(bookmark) => tweetInfoDispatch({ type: 'add_bookmark', payload: bookmark })}
                        deleteBookmark={(bookmarkID) => tweetInfoDispatch({ type: 'delete_bookmark', payload: bookmarkID })} />
                </div>
                <hr />
                <div className='flex w-full'>
                    {(canReply && (
                        <NewComment profile={profile} tweet={tweet} addComment={addCommentHandler} />
                    )) || (!canReply && (
                        <span className='flex text-gray-400'>
                            Only followers can reply to this tweet.
                        </span>
                    ))}
                </div>
                <hr />
            </div>
            <div className='flex flex-col w-full'>
                <Comments profile={profile} tweet={tweet} newComment={newComment} />
            </div>
        </div>
    )
}

export default Tweet
