import * as React from "react"

import { cn } from "@/lib/utils.ts"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import supabaseClient from "@/supabaseClient.ts";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx"

interface UserRegisterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterPage({ className, ...props }: UserRegisterProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const { data, error } = await supabaseClient.auth.signUp({
      email: values.email,
      password: values.password,
    })

    if (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-4'}>
            <FormField name='email' control={form.control} render={({field}) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )
            }}/>

            <FormField name={'password'} control={form.control} render={({field}) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )
            }}/>

            <Button disabled={isLoading} className={'mt-4 w-full'} type={'submit'}>
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
              )}
              Register
            </Button>
          </form>
        </Form>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </p>
    </>
  )
}