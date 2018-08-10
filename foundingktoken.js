var solc = require('solc');
var Web3 = require('web3');
var fs = require('fs');

//var web3 = new Web3();
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8553'));
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
//console.log(web3)

// Define the address to search witin.  CHANGE TO PULIC ADDRESSS ACTIVE private/test/live network
var addr = ('0xbb4fdf83996829b3479743d4b3fec6620e260e21');

// Use Wb3 to get the balance of the address, convert it and then show it in the console.
web3.eth.getBalance(addr, function (error, result) {
	if (!error)
    console.log(result)
		//console.log('Ether:', web3.utils.fromWei(result,'ether')); // Show the ether balance after converting it from Wei
	else
		console.log('Huston we have a promblem: ', error); // Should dump errors here
});

var filepath = 'kt-founding.sol';
var input = fs.readFileSync(filepath).toString();
//console.log(input);
//var input = 'contract x { function g() {} }';

var output = solc.compile(input, 1); // 1 activates the optimiser
console.log(output);

for (var contractName in output.contracts) {
      // code and ABI that are needed by web3
  //console.log(contractName + ': ' + output.contracts[contractName].bytecode);
  //console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface));

  var code = '0x' + output.contracts[contractName].bytecode;//compiled[keye[0]].code;
  //console.log(code);
  // contract json abi, this is autogenerated using solc CLI
  var abi = JSON.parse(output.contracts[contractName].interface);//compiled[keye[0]].info.abiDefinition;
  //console.log(abi);
  var myContract;
    //var blockwatch = web3.eth.filter('latest');
  //console.log(blockwatch);
  //console.log(web3);

  var myContract = new web3.eth.Contract(abi,{
      from: addr, // default from address
      gasPrice: '2100000' // default gas price in wei, 20 gwei in this case
  });
  //console.log(myContract);

  var deployContract = myContract.deploy({data:code});

  deployContract.send({
      from: addr,
      gas: 290001,
      gasPrice: '1'
    }, function(error, transactionHash){ })
    .on('error', function(error){  })
    .on('transactionHash', function(transactionHash){  })
    .on('receipt', function(receipt){
       console.log(receipt.contractAddress) // contains the new contract address
    })
    .on('confirmation', function(confirmationNumber, receipt){
        //console.log('confirm');
        //console.log(receipt);
      })
    .then(function(newContractInstance){
        console.log('now use transation');
        //console.log(newContractInstance);
        //console.log(newContractInstance.options.address) // instance with the new contract address
        newContractInstance.methods.newd().send({from: addr}).then(function(receipt){
            // receipt can also be a new contract instance, when coming fro
            console.log('put value address to contract');
            console.log(receipt);
        }).catch(function(error) {
        console.log(' send error');
        console.log(error);
        })
        .then(function(){
            console.log('reacall function');
            //console.log(newContractInstance);
            newContractInstance.methods.getd().call({from: addr}).then(function(receipt){
                // receipt can also be a new contract instance, when coming fro
                console.log('call back from');
                console.log(receipt);
            }).catch(function(error) {
            console.log(' call error');
            console.log(error);
            });
        })
    })
    .catch(function(error) {
    console.log(error);
    console.log(' recall catch');
    })
  .catch(function(error) {
  console.log(error);
  console.log(' last then catch');
  });

};
