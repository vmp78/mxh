import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import useShowToast from '../hooks/useShowToast';


const UserPage = () => {

    const [user,setUser]= useState(null);
    const {username}= useParams();
    const showToast= useShowToast();
    useEffect ( () => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data= await res.json();
                if(data.error){
                    showToast("Error",data.error,"error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error",error,"error");
            }
        };

        getUser();
    },[username,showToast]);   
    
    if(!user) return null;

    return (
        <>
            <UserHeader user={user} />
            {/* <UserPost likes={100}/> */}
        </>
    );
};

export default UserPage;