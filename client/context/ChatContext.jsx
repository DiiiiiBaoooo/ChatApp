import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages,setMessages] = useState([]);
    const[ users,setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null)
    const [unseenMessages,setUnseenMEssages] = useState({})

    const {socket,axios} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async ()=>{
        try {
         const {data} = await axios.get('/api/messages/users');
         if(data.success){
            setUsers(data.users);
            setUnseenMEssages(data.unseenMessages)
         }
        } catch (error) {
            toast.error(error.message)
        }
    }
//func to get messages for selected users
const getMessages = async(userId)=>{
    try {
        const {data} = await axios.get(`/api/messages/${userId}`);
        if(data.success)
        {
            setMessages(data.messages)
        }
    } catch (error) {
        toast.error(error.message)

    }
}
    const sendMessage = async(messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }
            else{
                toast.error(data.message)

            }
        } catch (error) {
            toast.error(error.message)

        }
    }
    //func to subcribe to meesagse for selected user
    const subcribeToMessages = async()=>{
        if(!socket) return;
        socket.on("newMessage",(newMessage)=>{
if(selectedUser && newMessage.senderId=== selectedUser._id){
    newMessage.seen= true;
    setMessages((prevMessages)=>[...prevMessages,newMessage]);
    axios.put(`/api/messages/mark/${newMessage._id}`);
}
else{
    setUnseenMEssages((prevUnseenMessages)=>({
        ...prevUnseenMessages, [newMessage.senderId] :prevUnseenMessages[newMessage.senderId] ?prevUnseenMessages[newMessage.senderId]+1 : 1
    }))
}
        })
    }
// func to unsubcribe from messages
const unsubcribeFromMessages = () =>{
    if(socket) socket.off("newMessage");
}
    useEffect(()=>{
            subcribeToMessages();
            return ()=>unsubcribeFromMessages();


    },[socket,selectedUser])
    const value= {
        messages,users,selectedUser,getUsers,getMessages,sendMessage,setSelectedUser,
        unseenMessages,setUnseenMEssages
    }
    return (
        <ChatContext.Provider value={value} >
            {children}

        </ChatContext.Provider>
    )
}