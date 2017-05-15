 var globUsers= [];

var users ={
    add:function(value){
        globUsers.push(value);
    },
    edit:function(id,new_Value){
        //delete first
        globUsers.remove("id", id);
        globUsers.push(new_Value);
        return new_Value;
    },
    getAll:function(){
        return globUsers;
    },
    delete:function(id){
        var obj = this.checkIfExists(id);
        globUsers.splice(globUsers.indexOf(obj), 1);
        //globUsers.remove("id", id);
        return obj;
    },
    checkIfExists:function(check_item_id){
        var arr_len = globUsers.length;
        for(var x=0; x<arr_len; x++){
            var id = globUsers[x]['id'];
            var item_value = globUsers[x]['item_value'];
            
            if(check_item_id==id){
                //it means the item exists
                return globUsers[x];
            }
        }

        return false;
    },
    checkUserExists: function(checkUserName){
        var arr_len = globUsers.length;
        for(var x=0; x<arr_len; x++){
            var userName = globUsers[x]['userName'];
            //console.log("userName==checkUserName",userName,checkUserName);
            if(userName==checkUserName){
                //it means the item exists
                return globUsers[x];
            }
        }

        return false;
    }

};
 
module.exports = users;