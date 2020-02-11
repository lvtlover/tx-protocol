Tx-protocol: Display all current and future data on BSV blockchain
=================

Since more and more apps are built on BSV blockchain, it's important to allow people view their data in a more user friendly way. We want to have a stable way to display data onchain, no matter how app is build.

How does it work?
====
TX protocol is in the form of tx://txid format where txid is the hash of the transaction. It's supposed to show data embeded in one transaction. It assume's every app will set it's own protocol id(PID) following OP_RETURN code. It will process the request in the following sequence?

1. Extract the PID from tx data.
2. Check if the PID has an existing endpoint to handle. ( For example: bico.media can handle b:// bcat:// etc ) If it does, it will read data from the endpoint, passing tx to the endpoint.
3. If the PID does not have an endpoint, check if it has a PID handler js (in protocol/identifier/handler.js) and pass tx.out, protocol id,tx to it. The handler.js is supposed to analyse data and output the desired display.

How to participate?
===

* Deveoper can help maintain the code, fix bugs and propose new improvements.
* App vendor can provide their endpoint to handle its own protocol, or provide code to display its own data.
* If you want submit your endpoint or js code, please sumbit an issue or start a pull request.

Where to use?
===
The new version of Maxthon browser, mx6, will implement TX protocol. www.maxthon.com
