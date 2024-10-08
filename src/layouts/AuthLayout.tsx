import { RegisterPage } from "@/pages/auth/RegisterPage.tsx";
import { cn } from "@/lib/utils.ts"
import { buttonVariants } from "@/components/ui/button.tsx"
import { Outlet, useLocation, Link } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

    return (
      <>
        <div className="container relative flex h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <Link
            to={isLoginPage ? '/register' : '/login'}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute right-4 top-4 md:right-8 md:top-8"
            )}
          >
            { isLoginPage ? 'Register' : 'Login' }
          </Link>
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              4toc
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;Rome wasn't built in a day, but they were laying bricks every hour.&rdquo;
                </p>
                <footer className="text-sm">John Heywood</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <Outlet />
            </div>
          </div>
        </div>
      </>
    )
  }