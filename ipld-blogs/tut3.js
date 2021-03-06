//Initiate ipfs and CID instance
const ipfsClient = require('ipfs-http-client');
const CID = require('cids');

//Connecting ipfs instance to infura node. You can also use your local node.
const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

function errOrLog(err, result) {
    if (err) {
      console.error('error: ' + err)
    } else {
      console.log(result)
    }
}

async function createAndFeatchNodes(){
    let vasa = await ipfs.dag.put({name: 'vasa'});

    //Linking secondNode to vasa using named link.
    let secondNode = await ipfs.dag.put({
        publication: {
            authors: {
                authorName: vasa
            }
        }
    });

    //featching multihash buffer from cid object.
    const multihash = secondNode.multihash;
    
    //passing multihash buffer to CID object to convert multihash to a readable format   
    const cids = new CID(1, 'dag-cbor', multihash);

    //Featching the value using links
    ipfs.dag.get(cids.toBaseEncodedString()+'/publication/authors/authorName/name', errOrLog);
    /* prints { value: 'vasa', remainderPath: '' } */
}
createAndFeatchNodes();