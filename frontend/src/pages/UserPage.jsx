// import { useEffect } from 'react';
// import axios from 'axios';

import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';

const userData ={
    name:"Nguyễn Đình Phúc",
    avt:'/public/avatar.JPG',
    tick: true,

}

const UserPage = () => {

    let postData = [
        {
            userName:"Nguyễn Đình Phúc",
            likesCount: 1200,
            repliesCount: 1000,
            postImg: '/public/post1.jpg',
            postTitle: '4K laptop background'
        },
        {
            likesCount: 123412,
            repliesCount: 1000,
            postImg: '/public/post2.jpg',
            postTitle: 'Spiderman comes home!'
        },
        {
            likesCount: 1231412,
            repliesCount: 1000,
            postImg: '/public/post3.jpg',
            postTitle: '4K laptop background'
        },
        {
            likesCount: 123,
            repliesCount: 1000,
            postImg: '/public/post1.jpg',
            postTitle: '4K laptop background'
        },
        {
            likesCount: 2341234,
            repliesCount: 1000,
            postImg: '/public/post1.jpg',
            postTitle: '4K laptop background'
        },
        {
            likesCount: 34656756,
            repliesCount: 1000,
            postImg: '/public/post1.jpg',
            postTitle: '4K laptop background'
        },
    ]

    return (
        <>
            <UserHeader />
            {postData.map((data, index) => (
                <UserPost key={index} data={data} userData={userData} />
            ))}
        </>
    );
};
// const name = 'hoa';

    // useEffect(() => {
    //     axios.get(`https://tiktok.fullstack.edu.vn/api/users/search?q=${name}&type=less`)
    //         .then(res => postData = res.data)
    //         .catch(err => console.log(err))
    // }, [])

export default UserPage;