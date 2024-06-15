import { atom } from 'recoil';
 
export const postsAtom = atom({
    key: 'postsAtom',
    default: [],
});
 
export const repostsAtom = atom({
    key: 'repostsAtom',
    default: [],
});