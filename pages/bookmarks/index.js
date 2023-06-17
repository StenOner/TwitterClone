import Bookmarks from '@/components/Bookmarks'
import withAuth from '@/hocs/withAuth'

const BookMarks = ({ myProfile }) => {
    return (
        <div className='flex justify-center pt-6 w-full'>
            <div className='flex flex-col space-y-6 max-w-3xl w-[70%] md:w-[60%]'>
                <Bookmarks myProfile={myProfile} />
            </div>
        </div>
    )
}

export default withAuth(BookMarks)
