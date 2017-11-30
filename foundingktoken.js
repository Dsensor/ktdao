var solc = require('solc');
var Web3 = require('web3');
var fs = require('fs');

//var web3 = new Web3();
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8553'));
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8553"));
}

var coinbase = web3.eth.coinbase;
console.log(coinbase);
var filepath = 'kt-founding.sol';
var input = fs.readFileSync(filepath).toString();
//console.log(input);
//var input = 'contract x { function g() {} }';

var output = solc.compile(input, 1); // 1 activates the optimiser
//console.log(output);
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
    from: '0xbc57766520498d942a12a6914958a9ed7f3f6960', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
//console.log(myContract);

var deployContract = myContract.deploy({data:code});

deployContract.send({
    from: '0xbc57766520498d942a12a6914958a9ed7f3f6960',
    gas: 1500000,
    gasPrice: '30000000000000'
}, function(error, transactionHash){ })
.on('error', function(error){  })
.on('transactionHash', function(transactionHash){  })
.on('receipt', function(receipt){
   console.log(receipt.contractAddress) // contains the new contract address
})
.on('confirmation', function(confirmationNumber, receipt){
    //sconsole.log('confirm');
    //console.log(receipt);
  })
.then(function(newContractInstance){
    console.log('now use transation');
    //console.log(newContractInstance);
    console.log(newContractInstance.options.address) // instance with the new contract address
    newContractInstance.methods.newd().send({from: '0xbc57766520498d942a12a6914958a9ed7f3f6960'}).then(function(receipt){
        // receipt can also be a new contract instance, when coming fro
        console.log('put value address to contract');
        console.log(receipt);
    });

    newContractInstance.methods.getd().call({from: '0xbc57766520498d942a12a6914958a9ed7f3f6960'}).then(function(receipt){
        // receipt can also be a new contract instance, when coming fro
        console.log('call back from');
        console.log(receipt);
    });

  });
};