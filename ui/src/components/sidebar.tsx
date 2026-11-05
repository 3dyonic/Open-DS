/**
 * Sidebar. The side navigation of an app.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { PanelLeftIcon } from "lucide-react";
import { Slot } from "radix-ui";

import { useIsMobile } from "../lib/use-mobile";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-[color:var(--sidebar-wrapper-background)]",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-[color:var(--sidebar-background)] text-[color:var(--sidebar-label)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) bg-[color:var(--sidebar-background)] p-0 text-[color:var(--sidebar-label)] [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-[color:var(--sidebar-label)] md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-[var(--sidebar-gap-duration)] ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-[var(--sidebar-container-duration)] ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-[var(--sidebar-padding)] group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex h-full w-full flex-col bg-[color:var(--sidebar-inner-background)] group-data-[variant=floating]:rounded-[var(--sidebar-inner-radius)] group-data-[variant=floating]:border group-data-[variant=floating]:border-[color:var(--sidebar-inner-border)] group-data-[variant=floating]:shadow-[var(--sidebar-inner-shadow)]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-[color:var(--sidebar-rail-line-hover)] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-[color:var(--sidebar-rail-line-hover)]",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-[color:var(--sidebar-inset-background)]",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-[var(--sidebar-inset-radius)] md:peer-data-[variant=inset]:shadow-[var(--sidebar-inset-shadow)] md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(
        "h-[var(--sidebar-input-height)] w-full bg-[color:var(--sidebar-input-background)] shadow-none",
        className,
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-[var(--sidebar-header-gap)] p-[var(--sidebar-header-padding)]", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-[var(--sidebar-footer-gap)] p-[var(--sidebar-footer-padding)]", className)}
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-[color:var(--sidebar-separator-background)]", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-[var(--sidebar-content-gap)] overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-[var(--sidebar-group-padding)]", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "flex h-[var(--sidebar-group-label-height)] shrink-0 items-center rounded-[var(--sidebar-group-label-radius)] px-[var(--sidebar-group-label-padding-x)] text-[length:var(--sidebar-group-label-font-size)]/[var(--sidebar-group-label-line-height)] [font-weight:var(--sidebar-group-label-font-weight)] text-[color:var(--sidebar-group-label-label)]/70 ring-[color:var(--sidebar-group-label-focus-ring)] outline-hidden transition-[margin,opacity] duration-[var(--sidebar-group-label-duration)] ease-linear [&>svg]:size-[var(--sidebar-group-label-icon-size)] [&>svg]:shrink-0 focus-visible:ring-[length:var(--sidebar-group-label-focus)] focus-visible:ring-[color:var(--sidebar-group-label-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--sidebar-group-label-focus-ring-offset-focus)]",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-[var(--sidebar-group-action-radius)] p-0 text-[color:var(--sidebar-group-action-label)] ring-[color:var(--sidebar-group-action-focus-ring)] outline-hidden transition-transform hover:bg-[color:var(--sidebar-group-action-background-hover)] hover:text-[color:var(--sidebar-group-action-label-hover)] [&>svg]:size-[var(--sidebar-group-action-icon-size)] [&>svg]:shrink-0 focus-visible:ring-[length:var(--sidebar-group-action-focus)] focus-visible:ring-[color:var(--sidebar-group-action-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--sidebar-group-action-focus-ring-offset-focus)]",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn(
        "w-full text-[length:var(--sidebar-group-content-font-size)]/[var(--sidebar-group-content-line-height)]",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-[var(--sidebar-menu-gap)]", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-[var(--sidebar-gap)] overflow-hidden rounded-[var(--sidebar-radius)] p-[var(--sidebar-padding)] text-left text-[length:var(--sidebar-font-size)]/[var(--sidebar-line-height)] ring-[color:var(--sidebar-focus-ring)] outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-[var(--sidebar-padding-right)] group-data-[collapsible=icon]:size-[var(--sidebar-size)]! group-data-[collapsible=icon]:p-[var(--sidebar-padding)]! hover:bg-[color:var(--sidebar-menu-button-background-hover)] hover:text-[color:var(--sidebar-label-hover)] active:bg-[color:var(--sidebar-menu-button-background-pressed)] active:text-[color:var(--sidebar-label-active)] disabled:pointer-events-none disabled:opacity-[var(--sidebar-disabled-opacity-disabled)] aria-disabled:pointer-events-none aria-disabled:opacity-[var(--sidebar-disabled-opacity-disabled)] data-[active=true]:bg-[color:var(--sidebar-menu-button-background-current)] data-[active=true]:[font-weight:var(--sidebar-font-weight)] data-[active=true]:shadow-[inset_var(--sidebar-focus)_0_0_0_var(--sidebar-selected)] data-[active=true]:text-[color:var(--sidebar-label)] data-[state=open]:hover:bg-[color:var(--sidebar-background-open-hover)] data-[state=open]:hover:text-[color:var(--sidebar-label-open-hover)] [&>span:last-child]:truncate [&>svg]:size-[var(--sidebar-icon-size)] [&>svg]:shrink-0 focus-visible:ring-[length:var(--sidebar-focus)] focus-visible:ring-[color:var(--sidebar-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--sidebar-focus-ring-offset-focus)]",
  {
    variants: {
      variant: {
        default:
          "hover:bg-[color:var(--sidebar-default-background-hover)] hover:text-[color:var(--sidebar-default-label-hover)]",
        outline:
          "bg-[color:var(--sidebar-outline-background)] shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-[color:var(--sidebar-outline-background-hover)] hover:text-[color:var(--sidebar-outline-label-hover)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default:
          "h-[var(--sidebar-default-height)] text-[length:var(--sidebar-default-font-size)]/[var(--sidebar-default-line-height)]",
        sm: "h-7 text-[length:var(--sidebar-sm-font-size)]/[var(--sidebar-sm-line-height)]",
        lg: "h-12 text-[length:var(--sidebar-lg-font-size)]/[var(--sidebar-lg-line-height)] group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-[var(--sidebar-menu-action-radius)] p-0 text-[color:var(--sidebar-menu-action-label)] ring-[color:var(--sidebar-menu-action-focus-ring)] outline-hidden transition-transform peer-hover/menu-button:text-[color:var(--sidebar-menu-action-label)] hover:bg-[color:var(--sidebar-menu-action-background-hover)] hover:text-[color:var(--sidebar-menu-action-label-hover)] [&>svg]:size-[var(--sidebar-menu-action-icon-size)] [&>svg]:shrink-0 focus-visible:ring-[length:var(--sidebar-menu-action-focus)] focus-visible:ring-[color:var(--sidebar-menu-action-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--sidebar-menu-action-focus-ring-offset-focus)]",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-[color:var(--sidebar-label)] data-[state=open]:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-[var(--sidebar-menu-badge-radius)] px-[var(--sidebar-menu-badge-padding-x)] text-[length:var(--sidebar-menu-badge-font-size)]/[var(--sidebar-menu-badge-line-height)] [font-weight:var(--sidebar-menu-badge-font-weight)] text-[color:var(--sidebar-menu-badge-label)] tabular-nums select-none",
        "peer-hover/menu-button:text-[color:var(--sidebar-menu-badge-label)] peer-data-[active=true]/menu-button:text-[color:var(--sidebar-menu-badge-label)]",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        "flex h-[var(--sidebar-menu-skeleton-height)] items-center gap-[var(--sidebar-menu-skeleton-gap)] rounded-[var(--sidebar-menu-skeleton-radius)] px-[var(--sidebar-menu-skeleton-padding-x)]",
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-[var(--sidebar-icon-size)] rounded-[var(--sidebar-radius)]"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-[var(--sidebar-height)] max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-[var(--sidebar-menu-sub-gap)] border-l border-[color:var(--sidebar-menu-sub-border)] px-[var(--sidebar-menu-sub-padding-x)] py-[var(--sidebar-menu-sub-padding-y)]",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-[var(--sidebar-menu-sub-button-gap)] overflow-hidden rounded-[var(--sidebar-menu-sub-button-radius)] px-[var(--sidebar-menu-sub-button-padding-x)] text-[color:var(--sidebar-menu-sub-button-label)] ring-[color:var(--sidebar-menu-sub-button-focus-ring)] outline-hidden hover:bg-[color:var(--sidebar-menu-sub-button-background-hover)] hover:text-[color:var(--sidebar-menu-sub-button-label-hover)] active:bg-[color:var(--sidebar-menu-sub-button-background-pressed)] active:text-[color:var(--sidebar-menu-sub-button-label-active)] disabled:pointer-events-none disabled:opacity-[var(--sidebar-menu-sub-button-disabled-opacity-disabled)] aria-disabled:pointer-events-none aria-disabled:opacity-[var(--sidebar-menu-sub-button-disabled-opacity-disabled)] [&>span:last-child]:truncate [&>svg]:size-[var(--sidebar-menu-sub-button-icon-size)] [&>svg]:shrink-0 [&>svg]:text-[color:var(--sidebar-menu-sub-button-label)] focus-visible:ring-[length:var(--sidebar-menu-sub-button-focus)] focus-visible:ring-[color:var(--sidebar-menu-sub-button-focus-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--sidebar-menu-sub-button-focus-ring-offset-focus)]",
        "data-[active=true]:bg-[color:var(--sidebar-menu-button-background-current)] data-[active=true]:text-[color:var(--sidebar-label)] data-[active=true]:shadow-[inset_var(--sidebar-focus)_0_0_0_var(--sidebar-selected)]",
        size === "sm" && "text-[length:var(--sidebar-font-size-2)]/[var(--sidebar-line-height-2)]",
        size === "md" && "text-[length:var(--sidebar-font-size)]/[var(--sidebar-line-height)]",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
