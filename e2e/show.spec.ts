import { expect, test } from '@playwright/test'
import { addSong } from './utils'

test.beforeEach(async ({page}) => {
  await addSong(page, 'a_song.mp3')
  await page.goto('/dance-player');
  await page.getByRole('listitem').click()
})

test('has components', async ({page}) => {
  await expect(page.getByRole('heading', { name: 'a_song' })).toBeVisible()
  await expect(page.locator('audio')).toHaveAttribute('src', /^blob:http:\/\/127\.0\.0\.1:5173\/.*/)
  await expect(page.getByText('0:00')).toBeVisible()
  await expect(page.getByText('0:11')).toBeVisible()

  await expect(page.getByRole('rowgroup').getByRole('button')).toHaveCount(7)
})

test('allows editing song title', async ({page}) => {
  const editButton = page.locator('div').filter({ hasText: /^a_song$/ }).getByRole('button').nth(1)
  const saveButton = page.getByRole('button', { name: 'Save' })
  const nameInput = page.getByLabel('Name')

  await expect(saveButton).not.toBeVisible()
  await expect(nameInput).not.toBeVisible()

  await editButton.click()

  await nameInput.fill('another title')
  await saveButton.click()

  await expect(saveButton).not.toBeVisible()
  await expect(nameInput).not.toBeVisible()
  await expect(page.getByRole('heading', { name: 'another title' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'another title' })).toBeVisible()

  await page.goto('/dance-player')
  await expect(page.getByRole('list')).toHaveText('another title')
})

test('plays audio', async ({page}) => {
  const currentTime = page.getByRole('progressbar').locator('span').first()
  const playButton = page.getByRole('rowgroup').getByRole('button').nth(1)
  await playButton.click()
  await expect(currentTime).toHaveText('0:02', {timeout: 5_000})
})

test('goes to different sections of the song', async ({page}) => {
  const progressBar = page.getByRole('progressbar')
  const currentTime = progressBar.locator('span').first()
  const playButton = page.getByRole('rowgroup').getByRole('button').nth(1)
  const bar = progressBar.locator('div').first()
  const box = await bar.boundingBox()
  const y = box.y + box.height - 5

  await page.mouse.click(box.x + box.width / 3, y)
  await expect(currentTime).toHaveText('0:03')

  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2, y)
  await page.mouse.up()
  await expect(currentTime).toHaveText('0:05')

  await playButton.click()
  await expect(currentTime).toHaveText('0:06')

  // Testing scrubbing while the player is playing might be flaky
  await page.mouse.move(box.x + box.width / 2, y)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 4, y)
  await page.mouse.up()

  await expect(currentTime).toHaveText('0:02')
})

test('adds bookmarks', async ({page}) => {
  const playButton = page.getByRole('rowgroup').getByRole('button').nth(1)
  const addBookmarkButton = page.getByRole('rowgroup').getByRole('button').nth(5)
  const goLeftButton = page.getByRole('rowgroup').getByRole('button').nth(0)
  const progressBar = page.getByRole('progressbar')
  const currentTime = progressBar.locator('span').first()
  const bar = progressBar.locator('div').first()
  const box = await bar.boundingBox()
  const y = box.y + box.height - 5

  await playButton.click()

  await expect(addBookmarkButton).toBeDisabled()
  await page.mouse.click(box.x + box.width / 4, y)
  await expect(currentTime).toHaveText('0:02')
  await expect(addBookmarkButton).not.toBeDisabled()
  await addBookmarkButton.click()

  await page.mouse.click(box.x + box.width / 2, y)
  await expect(currentTime).toHaveText('0:05')
  await goLeftButton.click()
  await expect(currentTime).toHaveText('0:02')
})
