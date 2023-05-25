import { BookmarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import useHttpToken from '@/hooks/use-http-token'

const BookmarkButton = ({ profile, tweet, bookmarks, addBookmark, deleteBookmark }) => {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const { error, isLoading, sendRequest } = useHttpToken()

    useEffect(() => {
        if (bookmarks.some((_bookmark) => _bookmark.profileID._id === profile._id)) {
            setIsBookmarked(true)
            return
        }
        setIsBookmarked(false)
    }, [bookmarks, profile, setIsBookmarked])

    const bookmarkTweetHandler = () => {
        const bookmarkTweetBody = {
            tweetID: tweet._id,
            profileID: profile._id,
            state: true,
        }
        sendRequest({ method: 'POST', url: 'tweets-bookmarks', body: bookmarkTweetBody }, ({ data }) => {
            addBookmark(data.tweetBookmark)
        })
    }

    const unBookmarkTweetHandler = () => {
        const bookmarkID = bookmarks.find((_bookmark) => _bookmark.profileID._id === profile._id)._id
        sendRequest({ method: 'DELETE', url: `tweets-bookmarks/${bookmarkID}` }, ({ data }) => {
            deleteBookmark(data.tweetBookmark._id)
        })
    }

    return (
        <div className={`${isBookmarked ? 'text-[#2D9CDB] ' : ''}flex flex-row space-x-2 py-2 px-6 cursor-pointer rounded-md hover:bg-gray-100`} onClick={isBookmarked ? unBookmarkTweetHandler : bookmarkTweetHandler}>
            <BookmarkIcon className='h-5' />
            <span className='hidden lg:flex'>Save{isBookmarked && 'd'}</span>
        </div>
    )
}

export default BookmarkButton