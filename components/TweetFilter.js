import { useState } from 'react'

const FILTER_MODES = {
    tweets: 'tweets',
    replies: 'tweets & replies',
    media: 'media',
    likes: 'likes',
}

const TweetFilter = ({ filterTweets }) => {
    const [currentFilterMode, setCurrentFilterMode] = useState(FILTER_MODES.tweets)

    const updateCurrentFilterModeHandler = (e) => {
        const filterMode = e.target.getAttribute('data-filter')
        setCurrentFilterMode(filterMode)
        filterTweets(filterMode)
    }

    return (
        <div className='flex flex-col justify-evenly p-4 mb-4 bg-white rounded-lg h-52 w-full sm:w-1/4 sm:mr-4 sm:mb-0'>
            <div className={`${currentFilterMode === FILTER_MODES.tweets ? 'bg-slate-100 text-blue-400' : 'text-gray-500'} font-semibold rounded-md py-2 px-1 cursor-pointer hover:bg-slate-100 hover:text-blue-400 transition-colors duration-200`} data-filter={FILTER_MODES.tweets} onClick={updateCurrentFilterModeHandler}>
                Tweets
            </div>
            <div className={`${currentFilterMode === FILTER_MODES.replies ? 'bg-slate-100 text-blue-400' : 'text-gray-500'} font-semibold rounded-md py-2 px-1 cursor-pointer hover:bg-slate-100 hover:text-blue-400 transition-colors duration-200`} data-filter={FILTER_MODES.replies} onClick={updateCurrentFilterModeHandler}>
                Tweets & Replies
            </div>
            <div className={`${currentFilterMode === FILTER_MODES.media ? 'bg-slate-100 text-blue-400' : 'text-gray-500'} font-semibold rounded-md py-2 px-1 cursor-pointer hover:bg-slate-100 hover:text-blue-400 transition-colors duration-200`} data-filter={FILTER_MODES.media} onClick={updateCurrentFilterModeHandler}>
                Media
            </div>
            <div className={`${currentFilterMode === FILTER_MODES.likes ? 'bg-slate-100 text-blue-400' : 'text-gray-500'} font-semibold rounded-md py-2 px-1 cursor-pointer hover:bg-slate-100 hover:text-blue-400 transition-colors duration-200`} data-filter={FILTER_MODES.likes} onClick={updateCurrentFilterModeHandler}>
                Likes
            </div>
        </div>
    )
}

export default TweetFilter