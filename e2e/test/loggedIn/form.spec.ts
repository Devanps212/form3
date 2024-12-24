import { expect, Page } from '@playwright/test'
import {test} from '../../fixture/index'
import { FORM_HEADER_SELECTORS, FORM_LABELS } from '../../constant/selector'
import { FORM_INPUT_SELECTORS } from '../../constant/selector/formInput'

test.describe("Access Control: Password Protection on Form", ()=>{

    let formName : string

    test.beforeEach("should goto form creation page", async({page}:{page: Page})=>{
        await page.goto('/admin/dashboard/active')
        await page.getByTestId(FORM_HEADER_SELECTORS.header)
        .getByRole('button', { name: FORM_LABELS.addNewForm }).click()
        await page.getByText(FORM_LABELS.startFromScratch).click()
        const form = page.getByTestId(FORM_INPUT_SELECTORS.formName)
        await expect(form).toBeVisible({timeout:50000})
        formName = await form.innerText()
    })

    // test.afterEach("should delete form recently added", async({
    //     page, 
    //     form
    // }:{
    //     page: Page, 
    //     form: UserForm
    // })=>{
    //     await page.goto('/admin/dashboard/active')
    //     await form.formDeletion({formName})
    // })

    test("should download submissions and verify PDF contents", async({
        page
    }:{
        page: Page
    })=>{

        await test.step("Step 1:Add input fields and publish the form", async()=>{
            const opinionScale = page.getByRole('button', { name: 'Opinion scale' })
            await opinionScale.scrollIntoViewIfNeeded()
            await opinionScale.click()
            await page.getByPlaceholder('Question').fill("Opinion Scale")

            const startRating = page.getByRole('button', { name: 'Star rating' })
            await startRating.scrollIntoViewIfNeeded()
            await startRating.click()
            await page.getByPlaceholder('Question').fill("Star rating")

            const matrix = page.getByRole('button', { name: 'Matrix' })
            await matrix.scrollIntoViewIfNeeded()
            await matrix.click()
            await page.getByPlaceholder('Question').fill("Matrix")

            await page.getByTestId('publish-button').click()
        })
        
        await test.step("Step 2:Select the values and submit form", async()=>{
            const pagePromise = page.waitForEvent('popup')
            await page.getByTestId('publish-preview-button').click()
            const page1 = await pagePromise

            await expect(
                page1.locator('div').
                filter({ hasText: 'Form TitleQuestion 1Email' }).nth(2))
                .toBeVisible({timeout:20000})
            await page1.getByRole('textbox').fill("sample@gmail.com")
            await page1.getByText('9').click()
            await page1.locator('path').nth(3).click()
            await page1.getByRole('row', { name: 'Row 1' }).locator('span').first().click()
            await page1.getByRole('row', { name: 'Row 2' }).locator('span').nth(1).click()

            const submit = page1.getByRole('button', { name: 'Submit' })
            await submit.scrollIntoViewIfNeeded()
            await submit.click()
            await expect(page1.locator('div')
            .filter({ hasText: '🎉Thank You.Your response has' })
            .nth(3))
            .toBeVisible()

            await page1.close()
        })

        await test.step("Step 3:Download submissions", async()=>{
            await page.getByRole('link', { name: 'Submissions' }).click()
            await page.getByRole('cell', { name: 'sample@gmail.com' }).hover()

            const view = page.getByRole('button', { name: 'View' })
            await expect(view).toBeVisible()
            await view.click()
            await expect(page.getByTestId('backdrop').getByRole('button').nth(1)).toBeVisible()
            await page.getByTestId('backdrop').getByRole('button').nth(1).click()
            
            
            await page.getByLabel('PDF').click()
            const downloadPromise = page.waitForEvent('download')
            await page.getByTestId('action-dropdown-btn').click()
            const download = await downloadPromise

            await download.saveAs('./e2e/downloads/' + download.suggestedFilename())
    
            await page.close()
        })
    })

})