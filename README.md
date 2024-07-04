# TODO

SDK code is in `src/`, with an example in `example/`. The remaining directories are only used in hardhat testing, and won't be published to npm.

### Test
First need to start local hardhat node with `hh node`, then deploy mock contracts with `hh ignition deploy ignition/modules/QP.ts --network localhost`. Then run tests with `hh test`

TODO: This can be improved to pass the hardhat node contract instance directly to the sdk, instead of deploying the mock contracts in the hardhat node. (need to test if this will work)