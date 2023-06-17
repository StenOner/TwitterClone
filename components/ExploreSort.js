import { useState } from 'react'

const SORT_MODES = {
    top: 'top',
    latest: 'latest',
    people: 'people',
    media: 'media',
}

const ExploreSort = ({ sortTweets }) => {
    const [currentSortMode, setCurrentSortMode] = useState(SORT_MODES.latest)

    const updateCurrentSortModeHandler = (e) => {
        const sortMode = e.target.getAttribute('data-filter')
        setCurrentSortMode(sortMode)
        sortTweets(sortMode)
    }

    return (
        <div className='flex flex-col justify-evenly p-4 mb-4 bg-white rounded-lg h-52 w-full'>
            <div className={`${currentSortMode === SORT_MODES.top ? 'bg-slate-100 text-blue-400' : 'text-gray-500'} font-semibold rounded-md py-2 px-1 cursor-pointer hover:bg-slate-100 hover:text-blue-400 transition-colors duration-200`} data-filter={SORT_MODES.top} onClick={updateCurrentSortModeHandler}>
                Top
            </div>
            <div className={`${currentSortMode === SORT_MODES.latest ? 'bg-slate-100 text-blue-400' : 'text-gray-500'} font-semibold rounded-md py-2 px-1 cursor-pointer hover:bg-slate-100 hover:text-blue-400 transition-colors duration-200`} data-filter={SORT_MODES.latest} onClick={updateCurrentSortModeHandler}>
                Latest
            </div>
            <div className={`${currentSortMode === SORT_MODES.people ? 'bg-slate-100 text-blue-400' : 'text-gray-500'} font-semibold rounded-md py-2 px-1 cursor-pointer hover:bg-slate-100 hover:text-blue-400 transition-colors duration-200`} data-filter={SORT_MODES.people} onClick={updateCurrentSortModeHandler}>
                People
            </div>
            <div className={`${currentSortMode === SORT_MODES.media ? 'bg-slate-100 text-blue-400' : 'text-gray-500'} font-semibold rounded-md py-2 px-1 cursor-pointer hover:bg-slate-100 hover:text-blue-400 transition-colors duration-200`} data-filter={SORT_MODES.media} onClick={updateCurrentSortModeHandler}>
                Media
            </div>
        </div>
    )
}

export default ExploreSort