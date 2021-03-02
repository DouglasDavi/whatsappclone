import React, {useState, useEffect} from 'react';
import './App.css';

import Api from './Api'

import ChatListItem from './components/ChatListItem';
import ChatIntro from './components/ChatIntro';
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';
import Login from './components/login'

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

export default () =>{
    
    const [chatlist, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState({});
    //usuário faker -- necessário trocar para null
    const [user, setUser] = useState({
        id:'ocrlfhDokHb9UA60lqWgyj5SmPA3',
        name: 'Douglas Davi',
        avatar: 'https://scontent.fjdf3-1.fna.fbcdn.net/v/t31.0-1/cp0/p86x86/28701014_103874460453906_2727951632312112803_o.jpg?_nc_cat=106&ccb=3&_nc_sid=dbb9e7&_nc_ohc=TmhsWhbcCk0AX9nAesA&_nc_ht=scontent.fjdf3-1.fna&tp=27&oh=20ab4639f65d1e76fc819a6144a01b16&oe=605E1C6B'
    });
    const [showNewChat, setShowNewChat] = useState(false);

    useEffect(()=>{
        if(user !== null){
            let unsub = Api.onChatList(user.id, setChatList)
            return unsub
        }
    },[user])

    const handleNewChat = () =>{       
        setShowNewChat(true);
    }

    const handleLoginData = async (u)=>{
        let newUser = {
            id: u.uid, 
            name: u.displayName,
            avatar: u.photoURL
        };
        await Api.addUser(newUser)
        setUser(newUser)
    }

    if(user === null){
        return(<Login onReceive={handleLoginData} />)
    }


    return(
        <div className="app-window">
            <div className="sidebar">
                <header>
                    <NewChat 
                        chatlist={chatlist}
                        user={user}
                        show={showNewChat}
                        setShow={setShowNewChat}
                    />
                    <img className="header-avatar" src={user.avatar} alt="" />
                    <div className="header-buttons">
                        <div className="header-btn">
                            <DonutLargeIcon style={{color: '#919191'}}/>
                        </div>
                        <div onClick={handleNewChat} className="header-btn">
                            <ChatIcon style={{color: '#919191'}}/>
                        </div>
                        <div className="header-btn">
                            <MoreVertIcon style={{color: '#919191'}}/>
                        </div>
                    </div>
                </header>
                <div className="search">
                    <div className="search-input">
                        <SearchIcon font-size="samll" style={{color: '#919191'}}/>
                        <input type="search" placeholder="Procurar ou Começar uma conversa"></input>
                    </div>
                </div>
                <div className="chatlist">                    
                    {chatlist.map((item,key)=>(                    
                        <ChatListItem 
                            key={key}
                            data={item}
                            active={activeChat.chatId === chatlist[key].chatId }
                            onClick={()=>setActiveChat(chatlist[key])}
                            //quando eu clico o chatlistItem ativa a função setactive
                            //e passa o objecto para variavel state activeChat
                        />
                    ))}
                </div>   
            
            </div>
            <div className="contentarea">
            {activeChat.chatId !== undefined &&
                    <ChatWindow 
                        user={user}
                        data={activeChat}
                    />
                }
                {activeChat.chatId === undefined &&
                    <ChatIntro />                 
                }
            </div>
        </div>
    )
}