import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';

const UserPage = () => {
    return (
        <>
            <UserHeader />
            <UserPost
                likesCount={1200}
                repliesCount={1000}
                postImg={'/public/post1.jpg'}
                postTitle={'4K laptop background'}
            />
            <UserPost likesCount={120} repliesCount={10} postImg={'/public/post2.JPG'} postTitle={'Critianoooooo'} />
            <UserPost
                likesCount={110}
                repliesCount={40}
                postImg={'/public/post3.JPG'}
                postTitle={'Spiderman comes home!'}
            />
        </>
    );
};

export default UserPage;
