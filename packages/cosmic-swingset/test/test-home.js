import '@agoric/install-ses';
import test from 'ava';
import bundleSource from '@agoric/bundle-source';

import { makeFixture, E } from './captp-fixture';

// This runs before all the tests.
let home;
let teardown;
test.before('setup', async t => {
  const { homeP, kill } = makeFixture();
  teardown = kill;
  home = await homeP;
  t.truthy('ready');
});

// Now come the tests that use `home`...
// =========================================

test.serial('home.registry', async t => {
  const { registry } = E.G(home);
  const regVal = await E(registry).get('foolobr_19191');
  t.is(regVal, undefined, 'random registry name is undefined');

  const target = 'something';
  const myRegKey = await E(registry).register('myname', target);
  t.is(typeof myRegKey, 'string', 'registry key is string');

  const registered = await E(registry).get(myRegKey);
  t.is(registered, target, 'registry registers target');
});

test.serial('home.board', async t => {
  const { board } = E.G(home);
  await t.throwsAsync(
    () => E(board).getValue('148'),
    { message: /board does not have id/ },
    `getting a value for a fake id throws`,
  );

  const myValue = {};
  const myId = await E(board).getId(myValue);
  t.is(typeof myId, 'string', `board key is string`);

  const valueInBoard = await E(board).getValue(myId);
  t.deepEqual(valueInBoard, myValue, `board contains myValue`);

  const myId2 = await E(board).getId(myValue);
  t.is(myId2, myId, `board gives the same id for the same value`);
});

test.serial('home.wallet - receive zoe invite', async t => {
  const { wallet, zoe, board } = E.G(home);

  // Setup contract in order to get an invite to use in tests
  const contractRoot = require.resolve(
    '@agoric/zoe/src/contracts/automaticRefund',
  );
  const bundle = await bundleSource(contractRoot);
  const installationHandle = await E(zoe).install(bundle);
  const { creatorInvitation: invite } = await E(zoe).startInstance(
    installationHandle,
  );

  // Check that the wallet knows about the Zoe invite issuer and starts out
  // with a default Zoe invite issuer purse.
  const zoeInviteIssuer = await E(zoe).getInvitationIssuer();
  const issuers = await E(wallet).getIssuers();
  const issuersMap = new Map(issuers);
  t.deepEqual(
    issuersMap.get('zoe invite'),
    zoeInviteIssuer,
    `wallet knows about the Zoe invite issuer`,
  );
  const invitePurse = await E(wallet).getPurse('Default Zoe invite purse');
  const zoeInviteBrand = await E(invitePurse).getAllegedBrand();
  t.is(
    zoeInviteBrand,
    await E(zoeInviteIssuer).getBrand(),
    `invite purse is actually a zoe invite purse`,
  );

  // The code below is meant to be carried out in a Dapp backend.
  // The dapp gets the depositBoardId for the default Zoe invite purse
  // and sends the invite.
  const inviteBrandBoardId = await E(board).getId(zoeInviteBrand);
  const depositBoardId = await E(wallet).getDepositFacetId(inviteBrandBoardId);
  const depositFacet = await E(board).getValue(depositBoardId);
  await E(depositFacet).receive(invite);

  // The invite was successfully received in the user's wallet.
  const invitePurseBalance = await E(invitePurse).getCurrentAmount();
  t.is(
    invitePurseBalance.value[0].description,
    'getRefund',
    `invite successfully deposited`,
  );
});

// =========================================
// This runs after all the tests.
test.after.always('teardown', async t => {
  await teardown();
  t.truthy('shutdown');
});
