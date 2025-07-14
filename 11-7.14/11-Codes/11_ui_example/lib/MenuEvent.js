
    function menuFuncMessage(msgName) {
        if ( msgName == "PushMsg" ) 
        {
            msgMgr.pushMsg( "START_LOADING_ANIM" );
        } 
        else if ( msgName == "RemoveMsg" ) 
        {
            msgMgr.pushMsg( "REMOVE_LOADING_ANIM" );
        }
    }

