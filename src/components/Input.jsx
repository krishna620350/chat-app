import React, { useContext, useState } from 'react';
import Img from '../img/img.png';
import Attach from '../img/attach.png';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const { currentUser } = useContext(AuthContext)
    const { data } = useContext(ChatContext)
    const handleSend = async() => {
        if (file) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                (error) => {
                    // setErr(true);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                        await updateDoc(doc(db, 'chats', data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            })
                        })
                    } catch (error) {
                        // setErr(true);
                    }
                }
            );
        } else {
            await updateDoc(doc(db, 'chats', data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
        }

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [data.chatId + '.lastMessage']: {
                text,
            },
            [data.chatId + '.date']: serverTimestamp()
        });
        await updateDoc(doc(db, 'userChats', data.user.uid), {
            [data.chatId + '.lastMessage']: {
                text,
            },
            [data.chatId + '.date']: serverTimestamp()
        });
        setText("");
        setFile(null);
    }

    return (
        <div className='input'>
            <input type="text" placeholder='Type something....' onChange={e => setText(e.target.value)} value={text}/>
            <div className="send">
                <img src={Attach} alt="" />
                <input type="file" name="" id="file" style={{ display: 'none' }} onChange={e=>setFile(e.target.files[0])}/>
                <label htmlFor="file">
                    <img src={Img} alt="" />
                </label>
                <button onClick={handleSend}>send</button>
            </div>
        </div>
    );
}

export default Input;