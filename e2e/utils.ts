import { Page } from '@playwright/test'
import * as path from 'path'

export const addSong = async (page: Page, songName: string) => {
  const prevUrl = page.url()
  await page.goto(`/dance-player`)
  const filePath = path.resolve(`./e2e/fixtures/${songName}`)
  const input = page.getByLabel('Choose file')
  await input.setInputFiles(filePath);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.goto(prevUrl)
}
