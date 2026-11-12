/**
 * Navigation menu. Site navigation with links and panels.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-[var(--navigation-menu-list-gap)]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" className={cn("relative", className)} {...props} />
  );
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-[var(--navigation-menu-trigger-radius)] bg-[color:var(--navigation-menu-trigger-background)] px-[var(--navigation-menu-trigger-padding-x)] py-[var(--navigation-menu-trigger-padding-y)] text-[length:var(--navigation-menu-trigger-font-size)]/[var(--navigation-menu-trigger-line-height)] [font-weight:var(--navigation-menu-trigger-font-weight)] transition-[color,box-shadow] outline-none hover:bg-[color:var(--navigation-menu-trigger-background-hover)] hover:text-[color:var(--navigation-menu-trigger-label-hover)] focus:bg-[color:var(--navigation-menu-trigger-background-highlight)] focus:text-[color:var(--navigation-menu-trigger-label-highlight)] disabled:pointer-events-none disabled:text-[color:var(--navigation-menu-trigger-disabled-label)] data-[state=open]:bg-[color:var(--navigation-menu-trigger-background-open)] data-[state=open]:text-[color:var(--navigation-menu-trigger-label-open)] data-[state=open]:hover:bg-[color:var(--navigation-menu-trigger-background-open-hover)] data-[state=open]:focus:bg-[color:var(--navigation-menu-trigger-background-open-highlight)] focus-visible:ring-[length:var(--navigation-menu-trigger-focus-width)] focus-visible:ring-[color:var(--navigation-menu-trigger-focus-ring)] focus-visible:ring-offset-[length:var(--navigation-menu-trigger-focus-offset)] focus-visible:ring-offset-[color:var(--navigation-menu-trigger-focus-ring-offset)]",
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-[var(--navigation-menu-trigger-icon-gap)] size-3 transition duration-[var(--navigation-menu-duration)] group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full p-[var(--navigation-menu-content-padding)] pr-[var(--navigation-menu-content-padding-right)] data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto duration-[var(--transition-panels-duration)] data-[motion^=from-]:ease-[var(--transition-enter-easing)] data-[motion^=to-]:ease-[var(--transition-exit-easing)] data-[motion^=to-]:duration-[var(--transition-exit-duration)]",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-[var(--overlay-offset)] group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-[var(--navigation-menu-content-radius)] group-data-[viewport=false]/navigation-menu:border-[length:var(--navigation-menu-content-border-width)] group-data-[viewport=false]/navigation-menu:border-[color:var(--navigation-menu-content-border)] group-data-[viewport=false]/navigation-menu:bg-[color:var(--navigation-menu-content-background)] group-data-[viewport=false]/navigation-menu:text-[color:var(--navigation-menu-content-label)] group-data-[viewport=false]/navigation-menu:shadow-[var(--navigation-menu-content-shadow)] group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 duration-[var(--transition-panels-duration)] group-data-[viewport=false]/navigation-menu:data-[state=open]:ease-[var(--transition-enter-easing)] group-data-[viewport=false]/navigation-menu:data-[state=closed]:ease-[var(--transition-exit-easing)] group-data-[viewport=false]/navigation-menu:data-[state=closed]:duration-[var(--transition-exit-duration)]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className={cn("absolute top-full left-0 isolate z-50 flex justify-center")}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-[var(--overlay-offset)] h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-[var(--navigation-menu-viewport-radius)] border-[length:var(--navigation-menu-viewport-border-width)] border-[color:var(--navigation-menu-viewport-border)] bg-[color:var(--navigation-menu-viewport-background)] text-[color:var(--navigation-menu-viewport-label)] shadow-[var(--navigation-menu-viewport-shadow)] data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)] duration-[var(--transition-panels-duration)] data-[state=open]:ease-[var(--transition-enter-easing)] data-[state=closed]:ease-[var(--transition-exit-easing)] data-[state=closed]:duration-[var(--transition-exit-duration)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-[var(--navigation-menu-link-gap)] rounded-[var(--navigation-menu-link-radius)] p-[var(--navigation-menu-link-padding)] text-[length:var(--navigation-menu-link-font-size)]/[var(--navigation-menu-link-line-height)] transition-all outline-none hover:bg-[color:var(--navigation-menu-link-background-hover)] hover:text-[color:var(--navigation-menu-link-label-hover)] focus:bg-[color:var(--navigation-menu-link-background-highlight)] focus:text-[color:var(--navigation-menu-link-label-focus)] data-[active=true]:bg-[color:var(--navigation-menu-link-background-current)] data-[active=true]:shadow-[inset_var(--navigation-menu-link-edge-width-current)_0_0_0_var(--navigation-menu-link-edge-current)] data-[active=true]:text-[color:var(--navigation-menu-link-label-current)] data-[active=true]:hover:bg-[color:var(--navigation-menu-link-background-hover)] data-[active=true]:focus:bg-[color:var(--navigation-menu-link-background-highlight)] [&_svg:not([class*='size-'])]:size-[var(--navigation-menu-link-icon-size)] [&_svg:not([class*='text-'])]:text-[color:var(--navigation-menu-link-icon)] focus-visible:ring-[length:var(--navigation-menu-link-focus-width)] focus-visible:ring-[color:var(--navigation-menu-link-focus-ring-focus)] focus-visible:ring-offset-[length:var(--navigation-menu-link-focus-offset)] focus-visible:ring-offset-[color:var(--navigation-menu-link-focus-ring-offset-focus)]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in duration-[var(--transition-panels-duration)] data-[state=visible]:ease-[var(--transition-enter-easing)] data-[state=hidden]:ease-[var(--transition-exit-easing)] data-[state=hidden]:duration-[var(--transition-exit-duration)]",
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 bg-[color:var(--navigation-menu-indicator-background)] shadow-[var(--navigation-menu-indicator-shadow)]" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
