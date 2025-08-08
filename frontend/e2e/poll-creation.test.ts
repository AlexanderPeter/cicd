import { Selector } from 'testcafe';
import { saveCoverage } from './utils/saveCoverage';

fixture`Umfrage E2E`.page`http://localhost:3000`.beforeEach(async (t) => {
  await t.setNativeDialogHandler(() => true);
});

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

  await saveCoverage('poll-creation');
});
