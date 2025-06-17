import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
    const [currState, setCurrState] = useState("Đăng ký")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio,setBio] = useState("")

    const [isDataSubmitted,setIsDataSubmitted] = useState(false)
    const {login} = useContext(AuthContext)

    const onSubmitHandler = (event) =>{
        event.preventDefault();
        if(currState ==="Đăng ký" && !isDataSubmitted){
            setIsDataSubmitted(true)
            return ;
        }
        login(currState==="Đăng ký" ?'signup' :'login',{fullName,email,password,bio})
    }


  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
            {/* left */}
            <img src={assets.logo_big} alt=""  className='w-[min(30vw,250px)]'/>
            {/* rigt */}
            <div className="">
    <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-50 p-6 flex flex-col gap-6 rounded-lg shadow-lg' action="">
<h2 className="font-medium text-2xl flex justify-between items-center">
    {currState} 
    {isDataSubmitted &&     <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='ư-5 cursor-pointer' />
}
</h2>
    {currState === "Đăng ký"  && !isDataSubmitted &&(
    <input 
    onChange={(e)=>setFullName(e.target.value)}
    value={fullName}
    type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Nhập tên ...'  required/>


    )}
{!isDataSubmitted && (
    <><input 
    onChange={(e)=>setEmail(e.target.value)}
    value={email}
    type="email" placeholder='Nhập Email...' required 
    className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
    <input 
    onChange={(e)=>setPassword(e.target.value)}
    value={password}
    type="password" placeholder='Nhập mật khẩu...' required 
    className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />

    </>
)}
{
    currState ==="Đăng ký" && isDataSubmitted &&(
        <textarea 
        onChange={(e)=>setBio(e.target.value)}
        value={bio}
        rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ' placeholder='Nhập tiểu sử' required>

        </textarea>
    )
}

<button type='submit'
className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
    {currState === "Đăng ký" ? "Tạo tài khoản": "Đăng nhập"}
</button>
<div className="flex items-center gap-2 text-sm text-gray-500">
    <input type="checkbox"  />
    <p> Agree to the terms of use & privacy policy.</p>
</div>

<div className="flex flex-col gap-2">
    {
        currState==="Đăng ký" ? (
            <p className='text-sm text-gray-600'>Đã có tài khoản?   <span onClick={()=>{setCurrState("Đăng nhập"); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Đăng nhập ngay</span></p>
        ): (
            <p className="text-sm text-gray-600">Tạo tài khoản <span  onClick={()=>{setCurrState("Đăng ký"); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>tại đây</span></p>
        )
    }
</div>
    </form>

            </div>

    </div>
  )
}

export default LoginPage