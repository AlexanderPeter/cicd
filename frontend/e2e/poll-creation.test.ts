import { Selector, ClientFunction } from 'testcafe';
import * as fs from 'fs';

const getCoverage = ClientFunction(() => (window as any).__coverage__);

fixture`Umfrage E2E`.page`http://localhost:3000`;

test('Neue Terminumfrage erstellen und Link kopieren', async (t) => {
  const createPollTile = Selector('div').withText('Neue Terminumfrage erstellen');
  await t.expect(createPollTile.exists).ok({ timeout: 10000 });
  await t.click(createPollTile);
  const pollTitleInput = Selector('input').withAttribute('name', 'pollTitle');
  await t.expect(pollTitleInput.exists).ok({ timeout: 10000 });
  await t.typeText(pollTitleInput, 'E2e-Meeting');
  const createButton = Selector('button').withText('Erstellen');
  await t.click(createButton);
  const linkInput = Selector('input').withAttribute('value');
  await t.expect(linkInput.exists).ok({ timeout: 10000 });
  const pollLink = await linkInput.value;
  console.log('Link:', pollLink);
  await t.expect(pollLink).contains('/polls/', 'Poll-Link ist nicht korrekt');

  const coverage = await getCoverage();
  fs.writeFileSync('./e2e/coverage.json', JSON.stringify(coverage));
});
