const BN = require('bn.js');
const bn = new BN();
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var curve = require('elliptic').curve;


function generateShares(length) {
  let array = [];
  for (let i = 0; i < length; i++) {
    let key = ec.genKeyPair();
    let priKey = key.getPrivate().umod(ec.n);
    let temp = new BN(priKey, "hex");
    //let temp = new BN((Math.random() * 10).toFixed(), "hex")
    array[i] = temp;
  }
  return array;;
}
let shares = [
  new BN("101621208045666826469369754704014417802499929056241239494376375832936859085947"),
  new BN("96238906217237445315411555687819671058683044360620728445336704304642567252854"),
  new BN("91968726343650243634858440923883239845307832164570735863007622380066207010833"),
  new BN("18464216268479142259809021353092478088418433628076463214180036465005108196720"),
  new BN("19470461098975391462671092990418683399269854717681574813887769884848045677036"),
  //new BN("12814144104266028346591893891903047233545221946003561171507942946806225669506"),
  //new BN("4"),
  //new BN("106926712516392484560520951438545001891023370236487666385857834323402449303984"),
  //new BN("113614830128753081675660990936548989392410151439319633048711963735716864446722"),
];
const nodeIndex = [
  new BN(1),
  new BN(2),
  new BN(3),
  new BN(4),
  new BN(5),
  new BN(6),

];
function lagrangeInterpolation(shares, nodeIndex) {
  let secret = new BN(0);
  for (let i = 0; i < shares.length; i += 1) {
    let upper = new BN(1);
    let lower = new BN(1);
    for (let j = 0; j < shares.length; j += 1) {
      if (i !== j) {
        upper = upper.mul(nodeIndex[j].neg());
        upper = upper.umod(ec.n);
        let temp = nodeIndex[i].sub(nodeIndex[j]);
        temp = temp.umod(ec.n);
        lower = lower.mul(temp).umod(ec.n);
      }
    }
    let delta = upper.mul(lower.invm(ec.n)).umod(ec.n);
    delta = delta.mul(shares[i]).umod(ec.n);
    secret = secret.add(delta);
  }

  return secret.umod(ec.n);
}
const derivedPrivateKey = lagrangeInterpolation(shares, nodeIndex);
console.log(derivedPrivateKey);

function generateSharesLagrangeInterpolation(shares, nodeIndex, priKey) {
  let secret = new BN(0);
  for (let i = 1; i <= 5; i += 1) {
    let upper = new BN(1);
    let lower = new BN(1);
    for (let j = 1; j <= 5; j += 1) {
      if (i !== j) {
        upper = upper.mul(nodeIndex[j].neg());
        upper = upper.umod(ec.n);
        let temp = nodeIndex[i].sub(nodeIndex[j]);
        temp = temp.umod(ec.n);
        lower = lower.mul(temp).umod(ec.n);
      }
    }
    let delta = upper.mul(lower.invm(ec.n)).umod(ec.n);
    if (i == 5) {
      secret = secret.umod(ec.n);
      let delta2 = priKey.sub(secret);
      let share = delta2.div(delta).umod(ec.n);
      //let share = ((priKey.sub(secret)).div(delta)).umod(ec.n);
      return share;

    }
    delta = delta.mul(shares[i]).umod(ec.n);
    secret = secret.add(delta);
  }
  return;
}

a = generateSharesLagrangeInterpolation(shares, nodeIndex, derivedPrivateKey);
shares[5] = new BN(a)


console.log(shares);





// console.log("share7: " + b);
// console.log("share8: " + c);
// console.log("share9: " + d);















//example y = x ^ 4 - 2x ^ 3 - x ^ 2 + 3x + 5

// const shares = [
//   new BN(6),
//   new BN(7),
//   new BN(32),
//   new BN(129),
//   new BN(370),
//   //new BN(4),
//   //new BN(27),
//   //new BN(122),
//   //new BN(361),
// ];
// const nodeIndex = [
//   new BN(1),
//   new BN(2),
//   new BN(3),
//   new BN(4),
//   new BN(5),
//   //new BN(-1),
//   //new BN(-2),
//   // new BN(-3),
//   // new BN(-4),
// ];






//20dfbe9414c31333b947040669adb038b8d77144e22cd917790a592d08ae0fb4


// const shares = [
//   new BN("643039303062656235623061383139363235336561343532363430363562333266653537336661306631363430613163613030643130336135623263613063353430396332303537313664386530363662376134303233643361353935333239", "hex"),
//   new BN("653439356638316431626261626532646164656265343066363365336234373335636261306239633235323862666662346537326665383932663738393564316165396137353137616666373261653262613534346331616230396664363764", "hex"),
//   new BN("376364363237396632316536353765646434313164393130626263353938336561353730656633303431653565666266323031623930353665386433653663653262643236336261653138623762616263613963373963343564346265663738", "hex"),
//   new BN("336365323065326564313733376135616466306464336230306237633938393564316530363561326639336238303761313532626139396266306661643237633839336539373734636263656365626234646264326130636631363634326632", "hex"),
//   new BN("326134643134646337393737633832363664613235623264616266643232333066326331303166663566643439323836666538343639386665613630303364636231386339323135643762643064383966393839333438376330643834383230", "hex"),
//   //new BN("623137306565336235366630303135323538613262626433626539386563303336323931613534346161333337646165326263633032323039313739663766343836306134666134363837653534306231613331396137646466666236306562", "hex"),
//   //new BN("383138393233663666323665393934646266336465663230353135316636633135346331323062663864363930323237623861653631623565353238306664333933383531333633643136626164636561303565633538383164306462316666", "hex"),
//   //new BN("376666666235306462653962656432373538373331356131313938303036386265636133656665356236316361316439666233666430663831343664636439626566323839356238373433633036623639323665646564636562376431386139", "hex")
// ];

// const nodeIndex = [
//   new BN("", "hex"),
//   new BN("", "hex"),
//   new BN("", "hex"),
//   new BN("", "hex"),
//   new BN("", "hex"),
//   //new BN("", "hex"),
//   //new BN("", "hex"),
//   // new BN("", "hex")
// ];

//https://app.openlogin.com/js/chunk-vendors.6e854d9d.js