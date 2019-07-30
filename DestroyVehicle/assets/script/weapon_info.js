var weapon_info={
    weapon_kind:null,
    weapon_num:null,
    level_now:10,
    weapon_nums:new Array(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1),
    weapon_time:new Array(6.25,6.25,5.882,5.882,5.882,5.634,5.517,5.387,5.225,5.128,5.004,4.883,4.767,4.648,4.534,4.423,4.316,4.211,4.108,4.008,3.910,3.815,3.724,3.641,3.542,3.458,3.372,3.372,3.372,3.372,3.372),
}

weapon_info.getPrice=function(weapon_kind,weapon_num){
    var price=0;
    if(weapon_kind==0)
    {
        if(weapon_num==1){
            price=100;
        }
        else
        {price=Math.floor(100*Math.pow(1.07,weapon_num-1));
        }
    }
    else if(weapon_kind==1)
    {
        if(weapon_num==1){
            price=1500;
        }
        else
        {
            price=1500*Math.pow(1.07,weapon_num-1);
        price=Math.floor(price);}
    }
    else if(weapon_kind==2)
    {
        if(weapon_num==0){
            price=6750;
        }
        else
        {
            price=6750*Math.pow(1.18,weapon_num-1);
            price=Math.floor(price);
        }
        
    }
    else 
    {
        if(weapon_num==0){
            price=6750*Math.pow(2.66,weapon_kind-2);
        }
        else
        {

        }
        price=6750*Math.pow(2.66,weapon_kind-2)*Math.pow(1.18,weapon_num-1);
    }
    price = Math.ceil(price);
    return price;
};
weapon_info.changeweapon=function(){
    //console.log("当前等级为"+weapon_info)
    var max=weapon_info.level_now-4;
    var best=max;
    var price=weapon_info.getPrice(max,weapon_info.weapon_nums[max]);
    var bestprice=price;
    var temp=max;
    var i=0;
    for(i=0;i<temp;i++){
        max=max-1;
        
       // console.log(bestprice);
        //console.log(max);
        //console.log(best);
         price=weapon_info.getPrice(max,weapon_info.weapon_nums[max])*Math.pow(2,i);
        // console.log(price);
         if(price<bestprice)
         {
             best=max;
             bestprice=price;
         }
    }
    console.log(best);
    return best;
};
weapon_info.getatk=function(weapon_kind){
    var atk=Math.floor(5*Math.pow(1.8,weapon_kind)); 
    return atk;
};
weapon_info.getpart=function(weapon_kind){
    var part=25*Math.pow(2,weapon_kind);
    return part;
};
weapon_info.gettime=function(weapon_kind){
    var time=weapon_info.weapon_time[weapon_kind];
    return time;
};