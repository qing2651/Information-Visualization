'use strict';

function MsgManager()
{
    var gThis = undefined;
    var msgHashmap = [];
    var MSG_WORKING = 1;
    var MSG_LOGGING = true;

    this.init = function()
    {
        gThis = this;
    }

    this.run = function()
    {
        for(var index in msgHashmap)
        {
            var msgVal = msgHashmap[ index ];
            msgProcess( index, msgVal );
        };
    }

    this.pushMsg = function( msg )
    {
        msgHashmap[ msg ] = MSG_WORKING;
        if(MSG_LOGGING) 
        {
            console.log( msg + " has been added to msg list!" );
        };
    }

    function msgProcess(msg, val)
    {
        if ( val == MSG_WORKING )
        {
            if ( msg == "START_GROUPBUNDLING" )
            {
                //edgeBunMgr.genD3GroupBundling();
                edgeBunMgr.genVisFMGroupBundling();
                edgeBunMgr.loadFeaViewData();
                deleteMsg( msg );
            }
            else if ( msg == "START_GROUPBUNDLING_DATA_RENDER" )
            {
                edgeBunMgr.genVisFMGroupBundlingData();
                edgeBunMgr.genVisFMGroupBundlingRender();
                deleteMsg( msg );
            }
            // Spin animation
            else if ( msg == "START_LOADING_ANIM" )
            {
                GCommonFuncUtility.DoStartLoadAnim( "query_container" );
                deleteMsg( msg );
            }
            else if ( msg == "REMOVE_LOADING_ANIM" )
            {
                GCommonFuncUtility.DoRemoveLoadAnim( "query_container" );
                deleteMsg( msg );
            }
        };
    }

    function deleteMsg( msg ) 
    {
        delete msgHashmap[msg];
        if(MSG_LOGGING) 
        {
            console.log( msg + " has been processed!" );
        };
    }
}