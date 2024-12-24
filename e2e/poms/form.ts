import { Page } from "@playwright/test";

export interface FormLabels {
    button:string,
    question: string
}

interface RowOrColumn {
    type: 'row' | 'column';
    placeHolder: string;
    fill: string;
    button?: string;
  }

export default class UserForm{
    constructor(
        private page:  Page
    ){}

    addInputsAndPublish = async({
        formLabels
    }:{
        formLabels:FormLabels[]
    })=>{
        for(let {button, question} of formLabels){
            const label = this.page.getByRole('button', { name: button })
            await label.scrollIntoViewIfNeeded()
            await label.click()
            await this.page.getByPlaceholder('Question').fill(question)
            if(question === "Rate customer service"){
                await this.page.getByRole('button', { name: 'Advanced properties' }).click()
                const advanceInput = this.page.getByPlaceholder('Field code')
                await advanceInput.clear()
                await advanceInput.fill("customer_service")
            }else if(question === "Rate customer representative"){

                const data: RowOrColumn[] = [
                    { type: 'row', placeHolder: 'Row 1', fill: 'Friendliness' },
                    { type: 'row', placeHolder: 'Row 2', fill: 'Knowledge' },
                    { type: 'row', button: 'Add row', placeHolder: 'input-option-2', fill: 'Quickness' },
                  
                    { type: 'column', placeHolder: 'Column 1', fill: 'Excellent' },
                    { type: 'column', placeHolder: 'Column 2', fill: 'Very good' },
                    { type: 'column', button: 'Add column', placeHolder: 'Column 3', fill: 'Very good' }
                  ];

                await this.inputAdd({
                    data
                })

                const advance = this.page.getByRole('button', { name: 'Advanced properties' })
                await advance.scrollIntoViewIfNeeded()
                await advance.click()

                const inputField = this.page.getByPlaceholder('Field code')
                await inputField.scrollIntoViewIfNeeded()
                await inputField.clear()
                await inputField.fill("customer_rep")

            }
        }

        await this.page.getByTestId('publish-button').click()
    }

    inputAdd = async({
        data
    } : {
        data: RowOrColumn[]
    })=>{
        const rows = data.filter(row=>row.type === 'row')
        const cols = data.filter(col=>col.type === "column")
        
        for(let {placeHolder, button, fill} of rows){
            if(button){
                await this.page.getByRole('button', { name: button }).click()
                const row3 = this.page.getByTestId(placeHolder)
                await row3.clear()
                await row3.fill(fill)
            }else{
                const row1 =  this.page.getByPlaceholder(placeHolder)
                await row1.clear()
                await row1.fill(fill)
            }
        }
        for(let {placeHolder, button, fill} of cols){
            if(button){
                await this.page.getByRole('button', { name: button }).click()
                const col = this.page.getByPlaceholder(placeHolder)
                await col.clear()
                await col.fill(fill)
            }else{
                const col = this.page.getByPlaceholder(placeHolder)
                await col.clear()
                await col.fill(fill)
            }
        }
    }
}