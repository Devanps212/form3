import { Page } from "@playwright/test";
import { ROW_COL } from "../constant/text";

export interface FormLabels {
    button:string,
    question: string,
    advanceFill?:string
}

export interface RowOrColumn {
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
        for(let {button, question,advanceFill} of formLabels){
            const label = this.page.getByRole('button', { name: button })
            await label.scrollIntoViewIfNeeded()
            await label.click()
            await this.page.getByPlaceholder('Question').fill(question)
            if(question === "Rate customer representative"){ 
                await this.inputAdd({
                    data: ROW_COL
                })
            }
            if(advanceFill){
                const advance = this.page.getByRole('button', { name: 'Advanced properties' })
                await advance.scrollIntoViewIfNeeded()
                await advance.click()

                const inputField = this.page.getByPlaceholder('Field code')
                await inputField.scrollIntoViewIfNeeded()
                await inputField.clear()
                await inputField.fill(advanceFill)
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