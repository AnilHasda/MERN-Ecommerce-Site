import React from 'react'
import { useDispatch,useSelector } from 'react-redux'
const Profile = () => {
  let data=useSelector(state=>state.responseData);
  console.log(data)
  return (
    <div>Profile</div>
  )
}

export default Profile