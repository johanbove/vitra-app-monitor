import { Database } from "vitra";

const STORAGE = "./db-storage-path";
const DB_PUBKEY =
  "76fd126565c8bcff78fb33c2c6d1693f5b3d2b95153afd9bf8d6a704c5b53a5f";
const ADMIN =
  "b3831fdfc16c093faef09dff4c98cf66711e1fdb8e0fe1745d9c71ff513e3831";

const db = await Database.load(STORAGE, DB_PUBKEY);
console.log("DB connected", db.pubkey.toString("hex"));

await db.swarm(); // share on the hypercore network

// await db.syncLatest();

console.log("isSwarming", db.isSwarming);
console.log("isExecutor", db.isExecutor);
console.log("isParticipant", db.isParticipant);
console.log("vmManager", db.vmManager);
console.log("vm", db.vm);
console.log("executor", db.executor);
console.log("numPeers", db.numPeers);
console.log("oplogs", db.oplogs);
console.log("index", db.index);
console.log("_readContractCode", await db._readContractCode())

const tx0 = await db.call("getAdmin");
console.log(tx0.response && tx0.response.value.pubkey === ADMIN ? 'Admin OK' : 'Unexpected Admin!'); // => ADMIN

const tx1 = await db.call("get", { key: "Hello" });
// console.log(tx1.response)
console.log('STATE', tx1.response.name, tx1.response.value); // => Hello World

// const verifyResults = await db.verify();
// console.log("verify", verifyResults);

console.log('Monitoring transactions...')
const mon = await db.monitor() // persistently monitor transactions
mon.on('violation', (stream) => console.log('violation', stream))
mon.on('validated', (stream) => console.log('validated', stream))
mon.on('added', (stream) => console.log('added', stream))
mon.on('changed', (stream) => console.log('changed', stream))

// db.unswarm();