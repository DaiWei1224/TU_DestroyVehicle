var weapon_info={
    weapon_kind:null,
    weapon_num:null,
    level_now:10,
    weapon_nums:new Array(0,0,0,0,0,0,0,0,0,-1,-1,-1,-1),
}
weapon_info.getPrice=function(weapon_kind,weapon_num){
    var price=0;
    if(weapon_kind==0)
    {
        if(weapon_num==0){
            price=100;
        }
        else
        {price=Math.floor(100*Math.pow(1.07,weapon_num-1));
        }
    }
    else if(weapon_kind==1)
    {
        if(weapon_num==0){
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
    return price;
};
weapon_info.changeweapon=function(){
    var max=weapon_info.level_now-3;
    var best=max;
    var price=weapon_info.getPrice(max,weapon_info.weapon_nums[max]);
    var bestprice=price;
    var i=0;
    for(i=1;i<8;i++){
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