import type { ZodIssue } from 'zod'
export function simplifyZodMessage(issues:ZodIssue[]) {
    return issues.reduce((acc, it)=>{
        acc[it.path[0]]=it.message
        return acc
    }, {}as Record<string,string>)
}