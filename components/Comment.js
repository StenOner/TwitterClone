import { Suspense, lazy } from 'react'
import CommentLikeButton from './CommentLikeButton'
import dateFormat from 'dateformat'
import Link from 'next/link'
import Loading from './Loading'
const ImageGallery = lazy(() => import('./ImageGallery'))
const ImageMediaContent = lazy(() => import('./ImageMediaContent'))

const Comment = ({ profile, comment }) => {
    return (
        <div className='flex flex-col bg-white rounded-xl mb-2 space-y-2 text-sm'>
            <div className='flex space-x-4'>
                <Suspense fallback={<Loading />}>
                    <ImageMediaContent
                        src={comment.profileID?.picture ?? '/images/default_profile_normal.png'}
                        className='rounded-lg max-h-11'
                        alt='Profile image' />
                </Suspense>
                <div className='flex flex-col space-y-1'>
                    <div className='flex space-x-2 items-center'>
                        <Link href={`/profile/${comment.profileID._id}`} className='font-semibold capitalize'>
                            {comment.profileID.fullName}
                        </Link>
                        <span className='text-gray-400 text-xs'>
                            {dateFormat(new Date(comment.createdAt), 'dd mmmm "at" HH:MM')}
                        </span>
                    </div>
                    <div className='flex w-full'>
                        <span>
                            {comment.content}
                        </span>
                    </div>
                    {comment.mediaContents?.length > 0 && (
                        <div className='flex w-full space-x-2'>
                            <Suspense fallback={<Loading />}>
                                <ImageGallery
                                    images={comment.mediaContents} />
                            </Suspense>
                        </div>
                    )}
                    <CommentLikeButton profile={profile} tweetComment={comment} />
                </div>
            </div>
        </div>
    )
}

export default Comment
