import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'

const ExploreSearch = ({ searchTweet }) => {
    const searchTermInputRef = useRef()
    let searchTermTimeout = undefined

    const updateSearchTermTimeoutHandler = () => {
        clearTimeout(searchTermTimeout)
        searchTermTimeout = setTimeout(() => searchTweet(searchTermInputRef.current.value), 300)
    }

    return (
        <div className='flex flex-row items-center w-full bg-white p-4 rounded-xl space-x-2'>
            <MagnifyingGlassIcon className='h-5' />
            <input ref={searchTermInputRef} type='text' placeholder='Search' className='w-full font-medium' onChange={updateSearchTermTimeoutHandler} />
        </div>
    )
}

export default ExploreSearch