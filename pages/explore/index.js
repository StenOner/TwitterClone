import ExploreTweets from '@/components/ExploreTweets'
import withAuth from '@/hocs/withAuth'

const Explore = ({ myProfile }) => {
    return (
        <div className='flex w-full pt-6'>
            <ExploreTweets profile={myProfile} />
        </div>
    )
}

export default withAuth(Explore)
