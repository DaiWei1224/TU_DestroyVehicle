window.money={};
money={
    partnum:0,
    diamondnum:0,
    speednum:0,
};
money.addmoney=function(moneynum){

};
money.reducemoney=function(moneynum)
{

};
money.getlabel=function(moneynum)
{
    moneynum=parseInt(moneynum);
   
    if(moneynum<1000)
    {

    
        return moneynum;
        
    }
    else if(moneynum<1000000)
    {
        moneynum=(moneynum/1000).toFixed(2);
        moneynum=moneynum+"k";
        return moneynum;
    }
    else if(moneynum<1000000000) 
    {
        moneynum=(moneynum/1000000).toFixed(2);
        moneynum=moneynum+"m";
        return moneynum;
    }
    else
    {

        moneynum=(moneynum/1000000000).toFixed(2);
        moneynum=moneynum+"b";
        return moneynum;
    }
}