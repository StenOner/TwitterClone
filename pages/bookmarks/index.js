import { Suspense } from 'react'
import Bookmarks from '@/components/Bookmarks'
import Loading from '@/components/Loading'
import withAuth from '@/hocs/withAuth'

const BookMarks = ({ myProfile }) => {
    return (
        <div className='flex justify-center pt-6 w-full'>
            <div className='flex flex-col space-y-6 max-w-3xl w-[70%] md:w-[60%]'>
                <Suspense fallback={<Loading />}>
                    <Bookmarks myProfile={myProfile} />
                </Suspense>
            </div>
        </div>
    )
}

export default withAuth(BookMarks)
