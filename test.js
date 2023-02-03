const BN = require('bn.js');
const bn = new BN();
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var curve = require('elliptic').curve;

const nodeIndex = [
    new BN(1),
    new BN(2),
    new BN(3),
    new BN(4),
    //new BN(5),
    new BN(6),
    //new BN(),
    //new BN(8),
    //new BN(9),
];



let shares = [
    new BN("e0ab90c33b947f88f2602872a09fe610cdddfb08c87c5eeb4d0b88a9c300ac7b", "hex"),
    new BN("d4c54a64c39a1fe48d8aa3a83a6e150a8ff4a550f8db73bceec1112ca9412b76", "hex"),
    new BN("cb5474563f5ff068c0e33ad8803215afa8e9c97e0a07aae95b98217149a99011", "hex"),
    new BN("28d2604581b43241769fe34b1f2543ee234fb3c866abb278786844fe7744f570", "hex"),
    //new BN("2b0be3f4a680699f75cb1ba70fb88e8f386d5f56de6c356b506040a31953d9ec", "hex"),
    new BN("e921593a12c95db86243ebf29594773b2031df8a980dfb08d58ef6cfbaa95b50", "hex"),
    //new BN("4"),
    //new BN("106926712516392484560520951438545001891023370236487666385857834323402449303984"),
    //new BN("113614830128753081675660990936548989392410151439319633048711963735716864446722"),
];


function lagrangeInterpolation(shares, nodeIndex) {
    if (shares.length !== nodeIndex.length) {
        return null;
    }
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


//privateket 46614476767777658307523919476986223844918179847846400990762178436108490408339

//20dfbe9414c31333b947040669adb038b8d77144e22cd917790a592d08ae0fb4

