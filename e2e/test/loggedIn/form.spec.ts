import { expect, Page } from '@playwright/test'
import {test} from '../../fixture/index'
import { FORM_HEADER_SELECTORS, FORM_LABELS } from '../../constant/selector'
import { FORM_INPUT_SELECTORS } from '../../constant/selector/formInput'
import UserForm, { FormLabels } from '../../poms/form'
import { FORM_LABEL1, FORM_LABEL2 } from '../../constant/text'

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
        page,
        form
    }:{
        page: Page,
        form: UserForm
    })=>{

        await test.step("Step 1:Add input fields and publish the form", async()=>{
            await form.addInputsAndPublish({formLabels: FORM_LABEL1})
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

            await page.waitForTimeout(8000)
            await download.saveAs('./e2e/downloads/' + download.suggestedFilename())
    
            await page.close()
        })
    })

    test("should prefill form using url parameters", async({
        page,
        form
    }:{
        page:Page,
        form:UserForm
    })=>{
        await test.step("Step 1:Add input fields and publish the form", async()=>{
            await form.addInputsAndPublish({
                formLabels:FORM_LABEL2,
            })
        })
        await test.step("Step 2:Verify Form Prefill via URL Parameters", async()=>{
            const pagePromise = page.waitForEvent('popup')
            await page.getByTestId('publish-preview-button').click()
            const page1 = await pagePromise

            const url = page1.url()
            const queryParams = new URLSearchParams({
                email: 'sample@gmail.com',
                customer_rating: '6',
                customer_service: '4',
                'customer_rep.Friendliness': 'Excellent',
                'customer_rep.Knowledge': 'Average',
                'customer_rep.Quickness': 'Very good'
            })
            
            await page1.goto(`${url}?${queryParams.toString()}`)

            const submit = page1.getByRole('button', { name: 'Submit' })
            await submit.scrollIntoViewIfNeeded()
            await submit.click()
            await expect(page1.locator('div')
            .filter({ hasText: '🎉Thank You.Your response has' })
            .nth(3))
            .toBeVisible({timeout:90000})

            await page1.close()
        })
    })

})