/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.example.mynetwork.approve} approve
 * @transaction
 */

async function approve(approve){
    
    for (var i=0;i<approve.coin.approvals.length;i++){
        if (approve.coin.approvals[i]==approve.approver){
            throw new Error('You have already approved this reward');
        }
    }
    if (approve.coin.recipent==approve.approver){
        throw new Error('You can not approve a reward that you are the recipent of');
    }
    approve.coin.approvals.push(approve.approver);

    if ((approve.coin.approvals.length==approve.coin.approvalCount)&approve.coin.status=="PENDING_APPROVAL"){
        approve.coin.owner=approve.coin.recipent;
        approve.coin.recipent.coinCount=approve.coin.recipent.coinCount+1;
        approve.coin.status="DELIVERED";
    }
    
    let getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    await getRewardCoin.update(approve.coin);
    let getEmployee=await getParticipantRegistry('org.example.mynetwork.employee');
    await getEmployee.update(approve.approver);
    await getEmployee.update(approve.coin.recipent);
    

}

/**
 * Sample transaction
 * @param {org.example.mynetwork.tradeCoin} tradeCoin
 * @transaction
 */
async function tradeCoin(trade) {   
    if (trade.asset.status=="DELIVERED"||trade.asset.status=="GIFTED"){
        trade.asset.owner.coinCount=trade.asset.owner.coinCount-1;
        trade.newOwner.coinCount=trade.newOwner.coinCount+1;
        let employeeRegistry=await getParticipantRegistry('org.example.mynetwork.employee');
        await employeeRegistry.update(trade.newOwner);
        await employeeRegistry.update(trade.asset.owner);
        trade.asset.sponsor=trade.asset.owner;
        trade.asset.owner=trade.newOwner;
        trade.asset.recipent=trade.newOwner;
        trade.asset.status="GIFTED";
        trade.asset.type="";
        trade.asset.description="";
       let assetRegistry=await getAssetRegistry('org.example.mynetwork.rewardCoin');
         await assetRegistry.update(trade.asset);
    }
    else{
        throw new Error('Coin must be in state DELIVERED or GIFTED to be traded');
    }
    }


      /**
 * Sample transaction
 * @param {org.example.mynetwork.autoApprove} autoApprove
 * @transaction
 */
async function autoApprove(auto) {   
    auto.coin.owner=auto.coin.recipent;
    auto.coin.status="DELIVERED";
    auto.coin.recipent.coinCount=auto.coin.recipent.coinCount+1;
    let getRewardCoin2= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    await getRewardCoin2.update(auto.coin);
    let getEmployee2=await getParticipantRegistry('org.example.mynetwork.employee');
    await getEmployee2.update(auto.approver);
    await getEmployee2.update(approve.coin.recipent);
    }

       /**
 * Sample transaction
 * @param {org.example.mynetwork.getRewardCoinWithID} getRewardCoinWithID
 * @returns {org.example.mynetwork.rewardCoins[]}
 * @transaction
 */

 
 async function getRewardCoinWithID(coin){
   	let jsonResults=[];
   		let results=await query('Q3',{'paramTeamID':"resource:org.example.mynetwork.team#"+coin.teamID});
     for(i=0;i<results.length;i++){
       let currentString=""+results[i];
       jsonResults[i]=currentString.split('id=')[1].replace("}","");
     }
     if(jsonResults==""){
        throw new Error('Q3 results came back with nothing Query results='+results+" JSON results="+jsonResults);
     }
   	let coinIDs=[];
   for(n=0;n<jsonResults.length;n++){
    let myCoins=[];
     let currentCoins=await query('Q4',{'paramTeamID': "resource:"+jsonResults[n]});
   	 if(currentCoins==""){
     	
     }
     else{
     	for(t=0;t<currentCoins.length;t++){
          let currentString2=""+currentCoins[t];
          myCoins[t]=currentString2.split('id=')[1].replace("}","");
        }
       	for(y=0;y<myCoins.length;y++){
          coinIDs.push(""+myCoins[y]);
        }
        
     }
     
     
     }

    const rewardCoins=[];
     const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    for(k=0;k<coinIDs.length;k++){
      
      let currentCoin=coinIDs[k].split('#')[1]+"";
      
      rewardCoins[k]=await getRewardCoin.get(currentCoin);
    }
   
   return rewardCoins;
     
  }

       /**
 * Sample transaction
 * @param {org.example.mynetwork.getTeam} getTeam
 * @returns {org.example.mynetwork.rewardCoins[]}
 * @transaction
 */

 async function getTeam(coin){

    let jsonQuery=[];
    let results=await query('Q6',{'paramDivisionID':"resource:org.example.mynetwork.division#"+coin.divisionID});

    for(n=0;n<results.length;n++){
        let currentString=""+results[n];
        jsonQuery[n]=currentString.split('id=')[1].replace("}","");
    }

    let jsonQueryTeam=[];

    for(k=0;k<jsonQuery.length;k++){
        let listEmployee=[];
        let Q3results=await query('Q3',{'paramTeamID':"resource:"+jsonQuery[k]});
        if(Q3results==""){

        }
        else{
            for(t=0;t<Q3results.length;t++){
                let currentString=""+Q3results[t];
                listEmployee[t]=currentString.split('id=')[1].replace("}","");
            }
    
            for(j=0;j<listEmployee.length;j++){
                jsonQueryTeam.push(""+listEmployee[j]);
            }
        }
        }

    let coinIDs=[];
   for(y=0;y<jsonQueryTeam.length;y++){
    let myCoins=[];
     let currentCoins=await query('Q4',{'paramTeamID': "resource:"+jsonQueryTeam[y]});
   	 if(currentCoins==""){
     	
     }
     else{
     	for(s=0;s<currentCoins.length;s++){
          let currentString2=""+currentCoins[s];
          myCoins[s]=currentString2.split('id=')[1].replace("}","");
        }
       	for(a=0;a<myCoins.length;a++){
          coinIDs.push(""+myCoins[a]);
        }
        
     }
     
     }

     const rewardCoins=[];
     const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    for(u=0;u<coinIDs.length;u++){
      
      let currentCoin=coinIDs[u].split('#')[1]+"";
      
      rewardCoins[u]=await getRewardCoin.get(currentCoin);
    }
   
   return rewardCoins;
     

}

/**
 * Sample transaction
 * @param {org.example.mynetwork.getCompany} getCompany
 * @returns {org.example.mynetwork.rewardCoins[]}
 * @transaction
 */

async function getCompany(coin){
    let jsonQuery=[];
    let results=await query('Q7',{'paramCompanyID':"resource:org.example.mynetwork.company#"+coin.companyID});

    for(n=0;n<results.length;n++){
        let currentString=""+results[n];
        jsonQuery[n]=currentString.split('id=')[1].replace("}","");
    }

    let coinIDs=[];
   for(y=0;y<jsonQuery.length;y++){
    let myCoins=[];
     let currentCoins=await query('Q4',{'paramTeamID': "resource:"+jsonQuery[y]});
   	 if(currentCoins==""){
     	
     }
     else{
     	for(s=0;s<currentCoins.length;s++){
          let currentString2=""+currentCoins[s];
          myCoins[s]=currentString2.split('id=')[1].replace("}","");
        }
       	for(a=0;a<myCoins.length;a++){
          coinIDs.push(""+myCoins[a]);
        }
        
     }
     
     }

     const rewardCoins=[];
     const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    for(u=0;u<coinIDs.length;u++){
      
      let currentCoin=coinIDs[u].split('#')[1]+"";
      
      rewardCoins[u]=await getRewardCoin.get(currentCoin);
    }
   
   return rewardCoins;


}

/**
 * Sample transaction
 * @param {org.example.mynetwork.purchase} purchase
 * @transaction
 */
async function purchase(purchase){
    const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    if(purchase.employee.coinCount<purchase.product.price){
        throw new Error("Not enough coins")
    }
    else{
        let myCoins=[];
        let currentCoins=await query('Q4',{'paramTeamID': "resource:org.example.mynetwork.employee#"+purchase.employee.employeeId});
        for(s=0;s<currentCoins.length;s++){
            let currentString2=""+currentCoins[s];
            myCoins[s]=currentString2.split('id=')[1].replace("}","");
            
          }
          
        for(t=0;t<purchase.product.price;t++){
            let coin=await getRewardCoin.get(myCoins[t].split("#")[1]);
            coin.owner=purchase.product.vendor;
            coin.recipent=purchase.product.vendor;
            purchase.employee.coinCount=purchase.employee.coinCount-1;
            await getRewardCoin.update(coin);
        }
        
        
        purchase.employee.products.push(purchase.product);
        let getEmployee=await getParticipantRegistry('org.example.mynetwork.employee');
        getEmployee.update(purchase.employee);
        

    }




}

/**
 * Sample transaction
 * @param {org.example.mynetwork.getProducts} getProducts
 * @transaction
 */
async function getProducts(purchase){
    let productsArray=[];
    const getProducts= await getAssetRegistry('org.example.mynetwork.product');
    
    for(t=0;t<purchase.productIDs.length;t++){
        productsArray[t]=await getProducts.get(purchase.productIDs[t]);
    }

    return productsArray;
    
}


/**
 * Test Transaction easily adding coin to an employees account
 * @param {org.example.mynetwork.addCoin} addCoin
 * @transaction
 */
async function addCoin(addCoin){
    const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    let getEmployee=await getParticipantRegistry('org.example.mynetwork.employee');
    addCoin.owner.coinCount=addCoin.owner.coinCount+1;
    await getEmployee.update(addCoin.owner);
    await getRewardCoin.add(addCoin.coin);
}


/**
 * Create challenge
 * @param {org.example.mynetwork.createChallenge} createChallenge
 * @transaction
 */
async function createChallenge(create){
    let getEmployee=await getParticipantRegistry('org.example.mynetwork.employee');
    create.challenge.sponsor.coinCount=create.challenge.sponsor.coinCount-create.challenge.rewardCoins.length;
    await getEmployee.update(create.challenge.sponsor);
    
    const getAdmin=await getParticipantRegistry('org.example.mynetwork.networkAdmin');

    const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');

    for(t=0;t<create.challenge.rewardCoins.length;t++){
        let adminUser=await getAdmin.get("adminjoe")
        create.challenge.rewardCoins[t].recipent=adminUser;
        create.challenge.rewardCoins[t].owner=adminUser;
        create.challenge.rewardCoins[t].sponsor=create.challenge.sponsor;
        create.challenge.rewardCoins[t].status="PENDING_CHALLENGE";
        await getRewardCoin.update(create.challenge.rewardCoins[t]);
    }
    
    
    const getChallenge= await getAssetRegistry('org.example.mynetwork.challenge');
    await getChallenge.add(create.challenge)
}


/**
 * Confirm challenge
 * @param {org.example.mynetwork.confirmChallenge} confirmChallenge
 * @transaction
 */
async function confirmChallenge(confirm){
    if(confirm.confirmer==confirm.challenge.sponsor){
    const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    
    for(t=0;t<confirm.challenge.rewardCoins.length;t++){
        confirm.challenge.rewardCoins[t].recipent=confirm.challenge.recipent;
        confirm.challenge.rewardCoins[t].owner=confirm.challenge.recipent;
        confirm.challenge.rewardCoins[t].sponsor=confirm.cofirmer;
        confirm.challenge.rewardCoins[t].status="CHALLENGE_COMPLETED";
        await getRewardCoin.update(confirm.challenge.rewardCoins[t]);
    }
    
    const getChallenge= await getAssetRegistry('org.example.mynetwork.challenge');
    confirm.challenge.status="COMPLETED"
    getChallenge.update(confirm.challenge);

    let getEmployee=await getParticipantRegistry('org.example.mynetwork.employee');
    confirm.challenge.recipent.coinCount=confirm.challenge.recipent.coinCount+confirm.challenge.rewardCoins.length;
    await getEmployee.update(confirm.challenge.recipent);

}
else{
    throw new Error("To confirm challenge you must be the one that set it")
}
}


/**
 * Deny challenge
 * @param {org.example.mynetwork.denyChallenge} denyChallenge
 * @transaction
 */
async function denyChallenge(deny){
    if(deny.confirmer==deny.challenge.sponsor){
    const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
    
    for(t=0;t<deny.challenge.rewardCoins.length;t++){
        deny.challenge.rewardCoins[t].recipent=deny.challenge.sponsor;
        deny.challenge.rewardCoins[t].owner=deny.challenge.sponsor;
        
    deny.challenge.rewardCoins[t].status="DELIVERED";
        await getRewardCoin.update(deny.challenge.rewardCoins[t]);
    }
    
    const getChallenge= await getAssetRegistry('org.example.mynetwork.challenge');
    deny.challenge.status="FAILED"
    getChallenge.update(deny.challenge);

    let getEmployee=await getParticipantRegistry('org.example.mynetwork.employee');
    deny.challenge.sponsor.coinCount=deny.challenge.sponsor.coinCount+deny.challenge.rewardCoins.length;
    await getEmployee.update(deny.challenge.sponsor);

}
else{
    throw new Error("To confirm challenge you must be the one that set it")
}
}


/**
 * Contribute to pot
 * @param {org.example.mynetwork.contribute} contribute
 * @transaction
 */

 async function contribute(con){
     if(con.backer==con.pot.author){
         throw new Error("Can't back your own pot")
     }
     else{
        const getRewardCoin= await getAssetRegistry('org.example.mynetwork.rewardCoin');
        const getAdmin=await getParticipantRegistry('org.example.mynetwork.networkAdmin');
        let getEmployee=await getParticipantRegistry('org.example.mynetwork.employee');
        let adminUser=await getAdmin.get("adminjoe");
         for(t=0;t<con.rewardCoins.length;t++){
            con.rewardCoins[t].recipent=adminUser;
            con.rewardCoins[t].owner=adminUser;
            con.rewardCoins[t].status="PENDING_POT"
            await getRewardCoin.update(con.rewardCoins[t]);
            con.pot.rewardCoins.push(con.rewardCoins[t]);
        }

        con.backer.coinCount=con.backer.coinCount-con.rewardCoins.length;
        await getEmployee.update(con.backer);
        
        
        const getPot= await getAssetRegistry('org.example.mynetwork.pot');
        if(!con.pot.backers.includes(con.backer)){
            con.pot.backers.push(con.backer);
        }
        await getPot.update(con.pot);

        if(con.pot.rewardCoins.length >= con.pot.goal){
            for(n=0;n<con.pot.rewardCoins.length;n++){
                con.pot.rewardCoins[n].recipent=con.pot.author;
                con.pot.rewardCoins[n].owner=con.pot.author;
                con.pot.rewardCoins[n].status="POT_COMPLETED"
                await getRewardCoin.update(con.pot.rewardCoins[n]);
            }
            
            let getEmployee=await getParticipantRegistry('org.example.mynetwork.employee');
            con.pot.author.coinCount=con.pot.author.coinCount+con.pot.rewardCoins.length;
            await getEmployee.update(con.pot.author);
            
            
            
            con.pot.status="GOAL_REACHED"
            await getPot.update(con.pot);

        }
     }
 }

 /**
 * Get pots
 * @param {org.example.mynetwork.getPots} getPots
 * @transaction
 */

 async function getPots(pots){
    
    let results=await query('Q7',{'paramCompanyID': pots.companyID});

    let potsArray=[];
    for(var i=0;i<results.length;i++){
        let currentResult=await query('Q12',{'paramID':"resource:org.example.mynetwork.employee#"+results[i].employeeId})
        for(var t=0;t<currentResult.length;t++){
            potsArray.push(currentResult[t]);
        }
    }

    return potsArray;


 }