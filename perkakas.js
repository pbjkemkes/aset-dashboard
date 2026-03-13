function formatPercent(value){

if(value === null || value === "" || value === undefined){
return "";
}

let num = parseFloat(value) * 100;

if(isNaN(num)){
return "";
}

return num.toFixed(2)
.replace(/\.00$/,'')
.replace(/(\.\d)0$/,'$1');

}
