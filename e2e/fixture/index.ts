import { test as base, Browser, Page } from "@playwright/test";
import UserLogin from "../poms/login";
import UserForm from "../poms/form";

interface Extended {
    login: UserLogin,
    form: UserForm
}

export const test = base.extend<Extended>({
    login: async({ page }:{ page: Page }, use)=>{
        const login = new UserLogin(page)
        use(login)
    },
    form: async({ page }:{ page: Page }, use)=>{
        const form = new UserForm(page)
        use(form)
    }
})