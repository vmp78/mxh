import { Input } from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import { useState, useEffect, useRef } from 'react';

const SearchBar = ({ setUsers, setInput, setLoading, w, reset, location }) => {
    const showToast = useShowToast();
    const r = useRef();

    useEffect(() => {
        if (reset) {
            setUsers([]);
            r.current.value = '';
        }
    }, [location]);

    const handleChange = async (value) => {
        setInput(value);
        setLoading(true);
        if (value) {
            try {
                const res = await fetch(`/api/users/search/${value}`);
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setUsers([]);
            return;
        }
    };

    return <Input ref={r} placeholder="Search for an account" w={w} onChange={(e) => handleChange(e.target.value)} />;
};

export default SearchBar;
