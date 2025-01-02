import { test, expect } from '@playwright/test'
import * as path from 'path'
import { addSong } from './utils'

test('has title', async ({page}) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Dance Player/)
})

test('has components', async ({page}) => {
  await page.goto('/')
  await expect(page).toHaveURL('http://127.0.0.1:5173/dance-player')

  await expect(page.getByRole('heading', {name: 'Your songs'})).toBeVisible()
  await expect(page.getByRole('list')).toHaveText('Empty')
  await expect(page.getByText('Choose file')).toBeVisible()
  await expect(page.getByLabel('Choose file')).toBeHidden()
  await expect(page.getByRole('button')).toHaveText('Create')
  await expect(page.getByLabel('File name')).toBeVisible()
})

test('adds a song, redirects to the song page, shows the song in the list', async ({page}) => {
  await page.goto('/dance-player')
  await page.getByText('Choose file').click()
  const filePath = path.resolve('./e2e/fixtures/a_song.mp3')
  const input = page.getByLabel('Choose file')
  await input.setInputFiles(filePath)
  await expect(page.getByLabel('File name')).toHaveValue('a_song')
  await page.getByRole('button', {name: 'Create'}).click()

  await expect(page).toHaveURL('http://127.0.0.1:5173/dance-player/songs/1')
  await page.goto('/dance-player')
  await expect(page.getByRole('list')).toHaveText('a_song')
})

test('deletes a song', async ({page}) => {
  await addSong(page, 'a_song.mp3')
  await page.goto('/dance-player')
  page.once('dialog', (dialog) => {
    expect(dialog.message()).toBe('Are you sure you want to delete a_song')
    dialog.accept()
  })
  await page.getByRole('listitem').getByRole('button').click()
  await expect(page.getByRole('list')).toHaveText('Empty')
})
