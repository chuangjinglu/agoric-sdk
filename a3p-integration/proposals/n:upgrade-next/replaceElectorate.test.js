import test from 'ava';
import '@endo/init';
import { GOV1ADDR, GOV2ADDR } from '@agoric/synthetic-chain';
import { passStyleOf } from '@endo/marshal';
import { GOV4ADDR, queryVstorageFormatted } from './agoric-tools.js';

const governanceAddresses = [GOV4ADDR, GOV2ADDR, GOV1ADDR];

test.serial('should be able to view the new accepted invitations', async t => {
  const instance = await queryVstorageFormatted(
    `published.agoricNames.instance`,
  );
  const instances = Object.fromEntries(instance);

  const wallet = await queryVstorageFormatted(
    `published.wallet.${GOV1ADDR}.current`,
  );
  const usedInvitations = wallet.offerToUsedInvitation.map(v => v[1]);

  const totalCharterInvitations = usedInvitations.filter(
    v => v.value[0].description === 'charter member invitation',
  ).length;

  t.is(totalCharterInvitations, 2);

  const totalCommitteeInvitations = usedInvitations.filter(v =>
    v.value[0].description.startsWith('Voter'),
  ).length;
  t.is(totalCommitteeInvitations, 2);

  const charterInvitation = usedInvitations.find(
    v =>
      v.value[0].instance.getBoardId() ===
      instances.econCommitteeCharter.getBoardId(),
  );
  t.is(passStyleOf(charterInvitation), 'copyRecord');

  const committeeInvitation = usedInvitations.find(
    v =>
      v.value[0].instance.getBoardId() ===
      instances.economicCommittee.getBoardId(),
  );
  t.is(passStyleOf(committeeInvitation), 'copyRecord');
});
