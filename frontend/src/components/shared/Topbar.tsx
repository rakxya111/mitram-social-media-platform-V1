import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
// import { useEffect } from 'react';
// import { useSignOutAccount } from '@/lib/react-query/queriesAndMutation'
// import { useUserContext } from '@/context/AuthContext'

const Topbar = () => {

    // const { mutate: signOut, isSuccess } = useSignOutAccount();

    const navigate = useNavigate();

    // const { user } = useUserContext();

    // useEffect(() => {
    //     if(isSuccess) navigate(0);
    // },[isSuccess])

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/Ram.svg"
            alt="logo"
            width={190}
            height={380}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
        
          >
            <img src="/assets/icons/log-out.svg" alt="logout" />
          </Button>
          <Link to={``} className="flex-center gap-3">
            <img
              src={ "/assets/images/profile-placeholder.svg"}
              alt="profile"
              className="h-8"
              w-8
              rounded-full
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Topbar